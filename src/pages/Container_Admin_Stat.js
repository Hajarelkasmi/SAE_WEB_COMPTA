import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Container_Admin_Stat = () => {
    const [globalData, setGlobalData] = useState({
        daily: {},
        weekly: {},
        monthly: {},
        yearly: {}
    });
    const [classesData, setClassesData] = useState({});
    const [EtudiantParClasse, setEtudiantParClasse] = useState({});
    const [active_data, setActive_data] = useState('daily');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/log/connexion',
                    { headers: { 'Authorization': localStorage.getItem('token') } });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération des statistiques');
                }
                const data = await response.json();

                const response2 = await fetch('http://localhost:5000/api/etudiants');
                if (!response2.ok) {
                    const errorText = await response2.text();
                    console.error('Réponse de l\'API:', errorText);
                    throw new Error('Erreur lors de la récupération des statistiques');
                }
                const data2 = await response2.json();
                const classes = groupDataByClasse(data2);
                const EtudiantclassesData = {};
                const ClassDataTrier = groupDataByClasse(data.logs);
                const ClassesData = {};

                for (const classe_id in classes) {
                    const nom_classe = data2.find(classe => classe.classe_id === parseInt(classe_id)).Classe.nom;
                    EtudiantclassesData[nom_classe] = classes[classe_id];
                    ClassesData[nom_classe] = ClassDataTrier[classe_id];
                }

                setGlobalData(groupDataByPeriod(data.logs));
                setClassesData(ClassesData);

                setEtudiantParClasse(EtudiantclassesData);
            } catch (error) {
                console.error('Erreur:', error);
            }
        }

        fetchData();
    }, []);

    const groupDataByPeriod = (data) => {
        const groupedData = {
            daily: {},
            weekly: {},
            monthly: {},
            yearly: {}
        };

        data.forEach(log => {
            const date = new Date(log.date);
            const day = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
            const week = `${date.getFullYear()}-S${Math.ceil(date.getDate() / 7)}`;
            const month = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
            const year = date.getFullYear();

            if (!groupedData.daily[day]) {
                groupedData.daily[day] = 0;
            }
            groupedData.daily[day]++;

            if (!groupedData.weekly[week]) {
                groupedData.weekly[week] = 0;
            }
            groupedData.weekly[week]++;

            if (!groupedData.monthly[month]) {
                groupedData.monthly[month] = 0;
            }
            groupedData.monthly[month]++;

            if (!groupedData.yearly[year]) {
                groupedData.yearly[year] = 0;
            }
            groupedData.yearly[year]++;
        });

        return groupedData;
    };

    const groupDataByClasse = (data) => {
        const groupedData = {};

        data.forEach(log => {
            if (!groupedData[log.classe_id]) {
                groupedData[log.classe_id] = 0;
            }
            groupedData[log.classe_id]++;
        });

        return groupedData;
    }

    const chartData = (data, label) => ({
        labels: Object.keys(data).reverse(),
        datasets: [
            {
                label: label,
                data: Object.values(data).reverse(),
                backgroundColor: ['rgb(6,102,140,1)', 'rgb(66,122,161,1)', 'rgb(235,242,250,1)', 'rgb(103,148,54,1)', 'rgba(164,189,1,1)'],
                borderColor: ['rgb(6,102,140,0.8)', 'rgb(66,122,161,0.8)', 'rgb(235,242,250,0.8)', 'rgb(103,148,54,0.8)', 'rgba(164,189,1,0.8)'],
                borderWidth: 1,
            },
        ],
    });

    return (
        <div className="stats">
            <h2>Statistiques de Connexion</h2>
            <div className="chart-row">
                <div className="first-chart-container">
                    <label>Nombre de connexions :</label>
                    <ul className="button-container">
                        <li><button onClick={() => setActive_data('daily')}>Jour</button></li>
                        <li><button onClick={() => setActive_data('weekly')}>Semaine</button></li>
                        <li><button onClick={() => setActive_data('monthly')}>Mois</button></li>
                        <li><button onClick={() => setActive_data('yearly')}>Année</button></li>
                    </ul>
                    <div id="barchart">
                        <Bar
                            data={chartData(globalData[active_data], 'Nombre de connexions')}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            font: {
                                                size: 10,
                                            },
                                        },
                                    },
                                    y: {
                                        ticks: {
                                            font: {
                                                size: 10,
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="chart-container">
                    <label>Nombre de connexion totale par classe :</label>
                    <div className='piechart'>
                        <Pie data={chartData(classesData, 'Nombre de connexions par classe')} />
                    </div>
                </div>
                <div className="chart-container">
                    <label>Nombre d'étudiants par classe :</label>
                    <div className='piechart'>
                        <Pie data={chartData(EtudiantParClasse, 'Nombre d\'étudiants par classe')} />
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default Container_Admin_Stat;