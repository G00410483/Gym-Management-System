import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import './Dashboard.css';
import axios from 'axios';

// Registering necessary Chart.js components for chart types used in the dashboard
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

function Dashboard() {
    // State to store dashboard data fetched from the server
    const [dashboardData, setDashboardData] = useState({
        totalMembers: 0,
        totalBookings: 0,
        totalClasses: 0,
        genders: [],
        memberships: [],
        mostBooked: [],
        membersTimeline: [],
        totalPayments: { total: 0, totalAmount: 0 },
        paymentsByYear: [],
        paymentsByMonth: []
    });

    // State to store the currently selected year for filtering payments by month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    // State to manage which dashboard section is currently active/visible
    const [activeSection, setActiveSection] = useState(''); // Initially, no section is active

    // Fetching dashboard data from the server
    useEffect(() => {
        axios.get('https://gms-deployment-heroku-129176233d83.herokuapp.com/dashboard')
            .then(response => {
                // Set dashboard data using Axios response data
                setDashboardData(response.data);
            })
            .catch(error => {
                // Log error if fetching fails
                console.error('Error fetching dashboard data:', error);
            });
    }, []);


    // Function to generate chart data structure for Pie, Line, and Bar charts
    // Reference: https://stackoverflow.com/questions/67655635/how-can-i-get-chart-js-to-automatically-add-colours-for-dynamic-labels
    const generateChartData = (labels, data, backgroundColors) => ({
        labels,
        datasets: [{ data, backgroundColor: backgroundColors, hoverOffset: 4 }]
    });

    // Preparing chart data for memberships, genders, and most booked classes
    const membershipsChartData = generateChartData(
        dashboardData.memberships.map(m => m.type_of_membership),
        dashboardData.memberships.map(m => m.count),
        ['#FF6384', '#36A2EB', '#FFCE56']
    );

    const gendersChartData = generateChartData(
        dashboardData.genders.map(g => g.gender),
        dashboardData.genders.map(g => g.count),
        ['#FF6384', '#36A2EB', '#FFCE56']
    );

    const mostBookedChartData = generateChartData(
        dashboardData.mostBooked.map(m => m.class_name),
        dashboardData.mostBooked.map(m => m.count),
        ['#FF6384', '#36A2EB', '#FFCE56', '#7BE495', '#B678FF']
    );

    // Preparing chart data for members timeline and payments by year/month
    // Reference: https://apexcharts.com/
    const membersTimelineChartData = {
        labels: dashboardData.membersTimeline.map(m => m.year.toString()),
        datasets: [{
            label: 'Members Over Time',
            data: dashboardData.membersTimeline.map(m => m.cumulative_total),
            fill: false,
            borderColor: '#DE0101',
            tension: 0.1
        }]
    };

    const paymentsByYearChartData = {
        labels: dashboardData.paymentsByYear.map(item => item.year.toString()),
        datasets: [{
            label: 'Total Amount',
            data: dashboardData.paymentsByYear.map(item => item.totalAmount),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const paymentsByMonthChartData = (() => {
        // Create an array of short-form month names (Jan, Feb, Mar, etc.) to use as labels in the chart
        const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));

        // Initialize an array to hold the total monthly amounts, with each element representing a month (initialized with zeros)
        const monthlyAmounts = Array(12).fill(0); // Initialize array with zeros for each month

        // Iterate through each payment in the paymentsByMonth array
        dashboardData.paymentsByMonth.forEach(payment => {
            // Check if the payment is made in the selected year
            if (payment.year === selectedYear) {
                // If the payment is made in the selected year, accumulate the total amount for the corresponding month
                monthlyAmounts[payment.month - 1] += payment.totalAmount; // Aggregate payments by month
            }
        });

        // Return an object containing labels (months) and dataset (total payments for each month in the selected year)
        return {
            labels: months,
            datasets: [{
                label: `Total Payments for ${selectedYear}`,
                data: monthlyAmounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Background color for the chart bars
                borderColor: 'rgba(255, 99, 132, 1)', // Border color for the chart bars
                borderWidth: 1 // Border width for the chart bars
            }]
        };
    })();



    const years = [...new Set(dashboardData.paymentsByYear.map(item => item.year))];

    // Configuration object for chart options 
    // Reference: https://www.chartjs.org/docs/latest/configuration/legend.html
    const options = {
        responsive: true,
        aspectRatio: 2.75,
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
        }
    };

    // Main function component rendering the dashboard
    return (
        // Wrapping div for the entire dashboard page
        <div className='page'>

            {/* Container for the section headers */}
            <div className="header-container">
                <h2 onClick={() => setActiveSection(activeSection === 'members' ? '' : 'members')} style={{ cursor: 'pointer' }}>Members</h2>
                <h2 onClick={() => setActiveSection(activeSection === 'payments' ? '' : 'payments')} style={{ cursor: 'pointer' }}>Payments</h2>
                <h2 onClick={() => setActiveSection(activeSection === 'classes' ? '' : 'classes')} style={{ cursor: 'pointer' }}>Classes</h2>
            </div>

            {/* Members Section */}
            {activeSection === 'members' && (
                <div className='dashboardSection'>
                    {/* Container for the members' timeline chart */}
                    <div className="chart-container" >
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', height: '400px' }}>
                            <Line data={membersTimelineChartData} options={options} />
                        </div>
                    </div>
                    {/* Container for the membership ratio chart */}
                    <div className="chart-container" >
                        <div>
                            <h3>Membership Ratio</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', height: '400px' }}>
                                {dashboardData.memberships.length > 0 && <Bar data={membershipsChartData} options={options} />}
                            </div>
                        </div>
                    </div>
                    {/* Container for the genders breakdown chart */}
                    <div className="chart-container" >
                        <div>
                            <h3>Genders Breakdown</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', height: '400px' }}>
                                {dashboardData.genders.length > 0 && <Pie data={gendersChartData} options={options} />}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payments Section */}
            {activeSection === 'payments' && (
                <div className='dashboardSection'>
                    {/* Year selector for filtering payments data */}
                    <div>
                        <label htmlFor="yearSelector" className="block mb-2">Select Year:</label>
                        <select
                            id="yearSelector"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="p-2 border border-gray-300 rounded-lg"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    {/* Container for displaying payments by month chart */}
                    <div className="chart-container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', height: '400px' }}>
                        <Bar data={paymentsByMonthChartData} options={options} />
                    </div>
                    {/* Container for displaying payments by year chart */}
                    <div className="chart-container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', height: '400px' }}>
                        <Bar data={paymentsByYearChartData} options={options} />
                    </div>
                </div>
            )}

            {/* Classes Section */}
            {activeSection === 'classes' && (
                <div className='dashboardSection'>
                    <h3>Classes Bookings</h3>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', height: '400px' }}>
                            {dashboardData.mostBooked.length > 0 && <Bar data={mostBookedChartData} options={options} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
