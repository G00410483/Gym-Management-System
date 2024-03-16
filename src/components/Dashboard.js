import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register the necessary components
Chart.register(...registerables);

function Dashboard() {
    // Initialize dashboardData with default values to ensure memberships is an array
    const [dashboardData, setDashboardData] = useState({
        totalMembers: 0,
        totalBookings: 0,
        genders: [],
        memberships: [] 
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
                    memberships: data.memberships || []
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
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED', '#4BC0C0'],
            hoverOffset: 4
        }]
    };
    const gendersChartData = {
        labels: dashboardData.genders.map(m => m.gender),
        datasets: [{
            data: dashboardData.genders.map(m => m.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED', '#4BC0C0'],
            hoverOffset: 4
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-700">Total Members: {dashboardData.totalMembers}</h3>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-700">Total Bookings: {dashboardData.totalBookings}</h3>
                </div>
                <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Memberships Breakdown</h3>
                    <div style={{ width: '400px', height: '250px' }}>
                        {dashboardData.memberships.length > 0 && <Pie data={membershipsChartData} options={options} />}
                    </div>
                </div>

                <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Genders Breakdown</h3>
                    <div style={{ width: '400px', height: '250px' }}>
                        {dashboardData.genders.length > 0 && <Pie data={gendersChartData} options={options} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
