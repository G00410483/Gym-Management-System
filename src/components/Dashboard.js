import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
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
        membersTimeline: [] // New state for members over time data
    });

    useEffect(() => {
        // Fetch Dashboard Data
        fetch('http://localhost:3001/dashboard')
            .then(response => response.json())
            .then(data => {
                // Ensure the data received is in the expected format or has the expected fallback values
                const formattedData = {
                    totalMembers: data.totalMembers || 0,
                    totalBookings: data.totalBookings || 0,
                    genders: data.genders || [],
                    memberships: data.memberships || [],
                    mostBooked: data.mostBooked || [],
                    membersTimeline: data.membersTimeline || [] // Setting the new data
                };
                setDashboardData(formattedData);
            })
            .catch(error => console.error('Error fetching dashboard data:', error));
    }, []);

    // Prepare data for the memberships pie chart
    const membershipsChartData = {
        labels: dashboardData.memberships.map(m => m.type_of_membership),
        datasets: [{
            data: dashboardData.memberships.map(m => m.count),
            backgroundColor: ['#BF0C00', '#000EE8', '#38C200'],
            hoverOffset: 4
        }]
    };
    const gendersChartData = {
        labels: dashboardData.genders.map(m => m.gender),
        datasets: [{
            data: dashboardData.genders.map(m => m.count),
            backgroundColor: ['#BF0C00', '#000EE8', '#38C200'],
            hoverOffset: 4
        }]
    };

    const mostBookedChartData = {
        labels: dashboardData.mostBooked.map(m => m.class_name),
        datasets: [{
            data: dashboardData.mostBooked.map(m => m.count),
            backgroundColor: ['#BF0C00', '#000EE8', '#38C200'],
            hoverOffset: 4
        }]
    };

    
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
               {/*  <div className="bg-white shadow-lg rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-700">Total Members: {dashboardData.totalMembers}</h3>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-700">Total Bookings: {dashboardData.totalBookings}</h3>
                </div> */}
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
