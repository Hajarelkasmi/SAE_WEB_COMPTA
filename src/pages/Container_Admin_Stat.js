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
    const [active_data , setActive_data] = useState('daily');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/log/connexion');
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
                    const nom_classe = data2.find(classe => classe.id === parseInt(classe_id)).Classe.nom;
                    EtudiantclassesData[nom_classe] = classes[classe_id];
                    ClassesData[nom_classe] = ClassDataTrier[classe_id];
                }

                setGlobalData(groupDataByPeriod(data.logs));
                setClassesData(ClassesData);

                setEtudiantParClasse(EtudiantclassesData);
            }
            catch (error) {
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
            groupedData.daily[day] ++;

            if (!groupedData.weekly[week]) {
                groupedData.weekly[week] = 0;
            }
            groupedData.weekly[week] ++;

            if (!groupedData.monthly[month]) {
                groupedData.monthly[month] = 0;
            }
            groupedData.monthly[month] ++;

            if (!groupedData.yearly[year]) {
                groupedData.yearly[year] = 0;
            }
            groupedData.yearly[year] ++;
        });
        
        return groupedData;
    };

    const groupDataByClasse = (data) => {
        const groupedData = {};

        data.forEach(log => {
            if (!groupedData[log.classe_id]) {
                groupedData[log.classe_id] = 0;
            }
            groupedData[log.classe_id] ++;
        });

        return groupedData;
    }

    const chartData = (data, label) => ({
        labels: Object.keys(data).reverse(),
        datasets: [
            {
                label: label,
                data: Object.values(data).reverse(),
                backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(192,192,75,0.8)', 'rgba(192,75,192,0.8)', 'rgba(192,75,75,0.8)', 'rgba(75,75,192,0.8)', 'rgba(75,192,75,0.8)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(192,192,75,1)', 'rgba(192,75,192,1)', 'rgba(192,75,75,1)', 'rgba(75,75,192,1)', 'rgba(75,192,75,1)'],
                borderWidth: 1,
            },
        ],
    });

    return (
        <div>
            <h2>Statistiques de Connexion</h2>
            <button onClick={() => setActive_data('daily')}>Jour</button>
            <button onClick={() => setActive_data('weekly')}>Semaine</button>
            <button onClick={() => setActive_data('monthly')}>Mois</button>
            <button onClick={() => setActive_data('yearly')}>Année</button>
            <Bar data={chartData(globalData[active_data], 'Nombre de connexions')} />

            <Pie data={chartData(classesData, 'Nombre de connexions par classe')} />
            <Pie data={chartData(EtudiantParClasse, 'Nombre d\'étudiants par classe')} />
        </div>
    );
}

export default Container_Admin_Stat;