import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import './Dashboard.css';

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
        fetch('http://localhost:3001/dashboard')
            .then(response => response.json())
            .then(setDashboardData)
            .catch(error => console.error('Error fetching dashboard data:', error));
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

    // Function that calculates and return data for displaying payments by month 
    const paymentsByMonthChartData = (() => {
        // Create an array of short-form month names (Jan, Feb, Mar, etc.) to use as labels in the chart
        // Creating an array of 12 elemets and mapping each element to its month name
        const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));

        // This function return and array that contains month labels and monthlyAmount data
        const monthlyAmounts = dashboardData.paymentsByMonth
            // Filter the payments to include only payments made in the selectede year 
            .filter(payment => payment.year === selectedYear)
            // Using reduce to aggregate payments by month 
            // Reference: https://stackoverflow.com/questions/59097172/why-i-cannot-reduce-an-array
            .reduce((acc, payment) => {
                acc[payment.month - 1] = payment.totalAmount;
                return acc; // Return accumulator for the next iteration
            }, new Array(12).fill(0)); // Initialize the accumulator with 12 zeros, one for each month.
        return {
            labels: months,
            datasets: [{
                label: `Total Payments for ${selectedYear}`,
                data: monthlyAmounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
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
            {/* Dashboard section for managing and displaying members' information */}
            <div className='dashboardSection' >
                {/* Section header for Members, clickable to toggle visibility of the section */}
                <h2 onClick={() => setActiveSection(activeSection === 'members' ? '' : 'members')} style={{ cursor: 'pointer' }}>Members</h2>
                {/* Conditional rendering for the Members section content */}
                {activeSection === 'members' && (
                    <div>
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
            </div>

            {/* Dashboard section for managing and displaying payments information */}
            <div className='dashboardSection' >
                {/* Section header for Payments, clickable to toggle visibility of the section */}
                <h2 onClick={() => setActiveSection(activeSection === 'payments' ? '' : 'payments')} style={{ cursor: 'pointer' }}>Payments</h2>
                {/* Conditional rendering for the Payments section content */}
                {activeSection === 'payments' && (
                    <div>
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
            </div>

            {/* Dashboard section for managing and displaying classes information */}
            <div className='dashboardSection'>
                {/* Section header for Classes, clickable to toggle visibility of the section */}
                <h2 onClick={() => setActiveSection(activeSection === 'classes' ? '' : 'classes')} style={{ cursor: 'pointer' }}>Classes</h2>
                {/* Conditional rendering for the Classes section content */}
                {activeSection === 'classes' && (
                    <div className="chart-container">
                        <div>
                            <h3>Classes Bookings</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', height: '400px' }}>
                                {dashboardData.mostBooked.length > 0 && <Bar data={mostBookedChartData} options={options} />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
