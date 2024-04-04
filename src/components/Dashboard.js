import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import './Dashboard.css';


// Register the necessary components
Chart.register(...registerables);

function Dashboard() {
    // Initialize dashboardData with default values to ensure memberships is an array
    const [dashboardData, setDashboardData] = useState({
        totalMembers: 0,
        totalBookings: 0,
        genders: [],
        memberships: [],
        mostBooked: [],
        membersTimeline: [],
        paymentTrends: [],
        genderBookingDistribution: [],
        classPopularityByDay: []
    });

    useEffect(() => {
        fetch('http://localhost:3001/dashboard')
            .then(response => response.json())
            .then(data => {
                setDashboardData(data);
            })
            .catch(error => console.error('Error fetching dashboard data:', error));
    }, []);

    const generateChartData = (labels, data, backgroundColors) => ({
        labels,
        datasets: [{
            data,
            backgroundColor: backgroundColors,
            hoverOffset: 4
        }]
    });

    const membershipsChartData = generateChartData(
        dashboardData.memberships.map(m => m.type_of_membership),
        dashboardData.memberships.map(m => m.count),
        ['#FF6384', '#36A2EB', '#FFCE56']
    );

    const gendersChartData = generateChartData(
        dashboardData.genders.map(m => m.gender),
        dashboardData.genders.map(m => m.count),
        ['#FF6384', '#36A2EB', '#FFCE56']
    );

    const mostBookedChartData = generateChartData(
        dashboardData.mostBooked.map(m => m.class_name),
        dashboardData.mostBooked.map(m => m.count),
        ['#FF6384', '#36A2EB', '#FFCE56']
    );

    const genderBookingDistributionChartData = generateChartData(
        dashboardData.genderBookingDistribution.map(m => m.gender),
        dashboardData.genderBookingDistribution.map(m => m.count),
        ['#FF6384', '#36A2EB']
    );

    
    const membersTimelineChartData = {
        labels: dashboardData.membersTimeline.map(m => m.year.toString()), // Convert year to string for labels
        datasets: [{
            label: 'Members Over Time',
            data: dashboardData.membersTimeline.map(m => m.cumulative_total), // Use cumulative_total for data
            fill: false,
            borderColor: '#DE0101',
            tension: 0.1
        }]
    };

    // New chart data setups
    const paymentTrendsChartData = {
        labels: dashboardData.paymentTrends.map(m => m.month),
        datasets: [{
            label: 'Revenue',
            data: dashboardData.paymentTrends.map(m => m.total),
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 2,
            fill: false,
        }]
    };

    const classPopularityByDayChartData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Bookings',
            data: dashboardData.classPopularityByDay.map(m => m.count),
            backgroundColor: '#FFCE56',
            borderColor: '#FF9F40',
            borderWidth: 2,
            fill: false,
        }]
    };


    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    boxWidth: 10,
                    font: {
                        size: 14
                    }
                }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
                <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-5 chart-container">
                <div className="chart-wrapper">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Membership Ratio</h3>
                        <div style={{ width: '100%', height: '250px' }}>
                            {dashboardData.memberships.length > 0 && <Pie data={membershipsChartData} options={options} />}
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Genders Breakdown</h3>
                        <div style={{ width: '100%', height: '250px' }}>
                            {dashboardData.genders.length > 0 && <Pie data={gendersChartData} options={options} />}
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Booked Classes</h3>
                        <div style={{ width: '100%', height: '250px' }}>
                            {dashboardData.mostBooked.length > 0 && <Pie data={mostBookedChartData} options={options} />}
                        </div>
                    </div>
                    
                </div>


                <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Members Over Time</h3>
                    <div style={{ width: '600px', height: '300px' }}>
                        {dashboardData.membersTimeline.length > 0 &&
                            <Line data={membersTimelineChartData} options={options} />}
                    </div>
                </div>
               
            </div>
            
        </div>
    );
}

export default Dashboard;
