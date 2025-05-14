import { fetchSchedules } from './collections.js';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';

// Process collections data for reports
export const processCollectionsData = async (startDate, endDate, timePeriod = 'daily') => {
    try {
        const collections = await fetchSchedules();
        const filteredCollections = collections.filter(collection => {
            const collectionDate = new Date(collection.date);
            return collectionDate >= new Date(startDate) && collectionDate <= new Date(endDate);
        });

        // Calculate daily collection volume
        const dailyCollection = calculateDailyCollection(filteredCollections, startDate, endDate);

        // Calculate daily collection by waste type
        const dailyCollectionByType = calculateDailyCollectionByType(filteredCollections, startDate, endDate);

        // Calculate daily completion rate
        const dailyCompletionRate = calculateCompletionRate(filteredCollections, startDate, endDate);

        // Calculate monthly collection volume
        const monthlyCollection = calculateMonthlyCollection(filteredCollections, startDate, endDate);

        // Calculate waste type distribution
        const wasteTypeDistribution = calculateWasteTypeDistribution(filteredCollections);

        // Calculate completion rate over time
        const completionRate = calculateCompletionRateOverTime(filteredCollections, startDate, endDate);

        // Calculate pending vs completed collections
        const pendingVsCompleted = calculatePendingVsCompleted(filteredCollections, startDate, endDate);

        // Calculate area performance
        const areaPerformance = calculateAreaPerformance(filteredCollections);

        // Calculate top waste generating areas
        const topWasteAreas = calculateTopWasteAreas(filteredCollections);

        return {
            dailyCollection,
            dailyCollectionByType,
            dailyCompletionRate,
            monthlyCollection,
            wasteTypeDistribution,
            completionRate,
            pendingVsCompleted,
            areaPerformance,
            topWasteAreas
        };
    } catch (error) {
        console.error('Error processing collections data:', error);
        throw error;
    }
};

const calculateDailyCollection = (collections, startDate, endDate) => {
    const days = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });
    const labels = days.map(day => format(day, 'EEE'));
    const data = days.map(day => {
        const dayCollections = collections.filter(c => {
            const collectionDate = new Date(c.date);
            return format(collectionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        });
        
        return dayCollections.reduce((total, curr) => {
            const weight = curr.weight ? parseInt(curr.weight.split(' ')[0]) : 0;
            return total + weight;
        }, 0);
    });

    return {
        labels,
        datasets: [{
            label: 'Waste Collected (kg)',
            data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }]
    };
};

const calculateDailyCollectionByType = (collections, startDate, endDate) => {
    const days = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });
    const labels = days.map(day => format(day, 'EEE'));
    const wasteTypes = ['Mixed', 'Organic', 'Recyclable', 'Hazardous'];
    const colors = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 205, 86, 0.5)',
        'rgba(201, 203, 207, 0.5)'
    ];

    const datasets = wasteTypes.map((type, index) => ({
        label: `${type} Waste`,
        data: days.map(day => {
            const dayCollections = collections.filter(c => 
                c.wasteType === type && 
                format(new Date(c.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
            );
            return dayCollections.reduce((total, curr) => {
                const weight = curr.weight ? parseInt(curr.weight.split(' ')[0]) : 0;
                return total + weight;
            }, 0);
        }),
        backgroundColor: colors[index]
    }));

    return { labels, datasets };
};

const calculateCompletionRate = (collections, startDate, endDate) => {
    const days = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });
    const labels = days.map(day => format(day, 'EEE'));
    const data = days.map(day => {
        const dayCollections = collections.filter(c => 
            format(new Date(c.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        );
        if (dayCollections.length === 0) return 0;
        const completed = dayCollections.filter(c => c.status === 'Completed').length;
        return Math.round((completed / dayCollections.length) * 100);
    });

    return {
        labels,
        datasets: [{
            label: 'Completion Rate (%)',
            data,
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
        }]
    };
};

const calculateMonthlyCollection = (collections, startDate, endDate) => {
    const start = startOfMonth(new Date(startDate));
    const end = endOfMonth(new Date(endDate));
    const months = eachDayOfInterval({ start, end })
        .filter(date => date.getDate() === 1)
        .map(date => format(date, 'MMM'));

    const data = months.map(month => {
        const monthCollections = collections.filter(c => 
            format(new Date(c.date), 'MMM') === month
        );
        return monthCollections.reduce((total, curr) => {
            const weight = curr.weight ? parseInt(curr.weight.split(' ')[0]) : 0;
            return total + weight;
        }, 0);
    });

    return {
        labels: months,
        datasets: [{
            label: 'Waste Collected (kg)',
            data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
};

const calculateWasteTypeDistribution = (collections) => {
    const wasteTypes = ['Mixed', 'Organic', 'Recyclable', 'Hazardous'];
    const data = wasteTypes.map(type => {
        return collections.filter(c => c.wasteType === type).length;
    });

    return {
        labels: wasteTypes,
        datasets: [{
            data,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)'
            ]
        }]
    };
};

const calculateCompletionRateOverTime = (collections, startDate, endDate) => {
    const months = eachDayOfInterval({
        start: startOfMonth(new Date(startDate)),
        end: endOfMonth(new Date(endDate))
    }).filter(date => date.getDate() === 1);

    const labels = months.map(month => format(month, 'MMM'));
    const data = months.map(month => {
        const monthCollections = collections.filter(c => 
            format(new Date(c.date), 'MMM') === format(month, 'MMM')
        );
        if (monthCollections.length === 0) return 0;
        const completed = monthCollections.filter(c => c.status === 'Completed').length;
        return Math.round((completed / monthCollections.length) * 100);
    });

    return {
        labels,
        datasets: [{
            label: 'Completion Rate (%)',
            data,
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
        }]
    };
};

const calculatePendingVsCompleted = (collections, startDate, endDate) => {
    const months = eachDayOfInterval({
        start: startOfMonth(new Date(startDate)),
        end: endOfMonth(new Date(endDate))
    }).filter(date => date.getDate() === 1);

    const labels = months.map(month => format(month, 'MMM'));
    const completedData = months.map(month => {
        return collections.filter(c => 
            format(new Date(c.date), 'MMM') === format(month, 'MMM') &&
            c.status === 'Completed'
        ).length;
    });

    const pendingData = months.map(month => {
        return collections.filter(c => 
            format(new Date(c.date), 'MMM') === format(month, 'MMM') &&
            c.status === 'Scheduled'
        ).length;
    });

    return {
        labels,
        datasets: [
            {
                label: 'Completed',
                data: completedData,
                backgroundColor: 'rgb(75, 192, 192)'
            },
            {
                label: 'Pending',
                data: pendingData,
                backgroundColor: 'rgb(255, 99, 132)'
            }
        ]
    };
};

const calculateAreaPerformance = (collections) => {
    const areas = [...new Set(collections.map(c => c.location.split(' ')[0]))];
    const collectionsPerArea = areas.map(area => {
        const areaCollections = collections.filter(c => c.location.startsWith(area));
        return {
            collections: areaCollections.length,
            completionRate: areaCollections.length > 0
                ? Math.round((areaCollections.filter(c => c.status === 'Completed').length / areaCollections.length) * 100)
                : 0
        };
    });

    return {
        labels: areas,
        datasets: [
            {
                label: 'Collections',
                data: collectionsPerArea.map(a => a.collections),
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            },
            {
                label: 'Completion Rate (%)',
                data: collectionsPerArea.map(a => a.completionRate),
                backgroundColor: 'rgba(153, 102, 255, 0.5)'
            }
        ]
    };
};

const calculateTopWasteAreas = (collections) => {
    const areas = [...new Set(collections.map(c => c.location.split(' ')[0]))];
    const wasteByArea = areas.map(area => {
        const areaCollections = collections.filter(c => c.location.startsWith(area));
        const totalWaste = areaCollections.reduce((total, curr) => {
            const weight = curr.weight ? parseInt(curr.weight.split(' ')[0]) : 0;
            return total + weight;
        }, 0);
        return { area, totalWaste };
    });

    const sortedAreas = wasteByArea
        .sort((a, b) => b.totalWaste - a.totalWaste)
        .slice(0, 5);

    return {
        labels: sortedAreas.map(a => a.area),
        datasets: [{
            label: 'Waste Generated (kg)',
            data: sortedAreas.map(a => a.totalWaste),
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }]
    };
}; 