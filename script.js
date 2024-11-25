// Daten abrufen
fetch('data.php')
    .then(response => response.json())
    .then(data => {
        // Für jeden Server ein Diagramm erstellen
        data.forEach(serverData => {
            const serverName = serverData.server;
            const times = serverData.metrics.map(metric => metric.time);
            const cpuUsage = serverData.metrics.map(metric => metric.cpu);
            const memoryUsage = serverData.metrics.map(metric => metric.memory);
            const diskUsage = serverData.metrics.map(metric => metric.disk);
            const networkUsage = serverData.metrics.map(metric => metric.network);

            // Diagrammdaten vorbereiten
            const traces = [
                {
                    x: times,
                    y: cpuUsage,
                    name: 'CPU Usage (%)',
                    type: 'scatter'
                },
                {
                    x: times,
                    y: memoryUsage,
                    name: 'Memory Usage (%)',
                    type: 'scatter'
                },
                {
                    x: times,
                    y: diskUsage,
                    name: 'Disk Usage (%)',
                    type: 'scatter'
                },
                {
                    x: times,
                    y: networkUsage,
                    name: 'Network Usage (MB)',
                    type: 'scatter'
                }
            ];

            // Layout für das Diagramm
            const layout = {
                title: `${serverName} Monitoring`,
                xaxis: { title: 'Time' },
                yaxis: { title: 'Usage' },
                margin: { t: 50 }
            };

            // Neuen Div-Container für das Diagramm erstellen
            const chartDiv = document.createElement('div');
            chartDiv.id = `chart-${serverName.replace(/\s+/g, '-')}`;
            chartDiv.style.marginBottom = '50px';
            document.body.appendChild(chartDiv);

            // Diagramm anzeigen
            Plotly.newPlot(chartDiv.id, traces, layout);
        });
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));
// Funktion zum Rendern eines Servers
function renderServer(serverData) {
    const container = document.getElementById('server-container');
    const serverName = serverData.server;
    const times = serverData.metrics.map(metric => metric.time);
    const cpuUsage = serverData.metrics.map(metric => metric.cpu);
    const memoryUsage = serverData.metrics.map(metric => metric.memory);
    const diskUsage = serverData.metrics.map(metric => metric.disk);
    const networkUsage = serverData.metrics.map(metric => metric.network);

    // Neues Feld für den Server erstellen
    const serverField = document.createElement('div');
    serverField.className = 'server-field';

    const serverTitle = document.createElement('h2');
    serverTitle.textContent = serverName;
    serverField.appendChild(serverTitle);

    const chartDiv = document.createElement('div');
    chartDiv.className = 'server-chart';
    serverField.appendChild(chartDiv);

    container.appendChild(serverField);

    // Diagrammdaten vorbereiten
    const traces = [
        {
            x: times,
            y: cpuUsage,
            name: 'CPU Usage (%)',
            type: 'scatter'
        },
        {
            x: times,
            y: memoryUsage,
            name: 'Memory Usage (%)',
            type: 'scatter'
        },
        {
            x: times,
            y: diskUsage,
            name: 'Disk Usage (%)',
            type: 'scatter'
        },
        {
            x: times,
            y: networkUsage,
            name: 'Network Usage (MB)',
            type: 'scatter'
        }
    ];

    const layout = {
        title: `${serverName} Monitoring`,
        xaxis: { title: 'Time' },
        yaxis: { title: 'Usage' },
        margin: { t: 40 }
    };

    // Diagramm in das passende Feld einfügen
    Plotly.newPlot(chartDiv, traces, layout);
}

// Initiale Server-Daten laden
fetch('data.php')
    .then(response => response.json())
    .then(data => {
        data.forEach(renderServer);
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));

// Logik für den Button "Server hinzufügen"
document.getElementById('add-server-button').addEventListener('click', () => {
    const serverName = document.getElementById('server-name').value;
    const serverData = document.getElementById('server-data').value;

    try {
        const parsedData = JSON.parse(serverData);
        const newServer = {
            server: serverName,
            metrics: parsedData
        };

        // Render neuen Server
        renderServer(newServer);

        // Felder zurücksetzen
        document.getElementById('server-name').value = '';
        document.getElementById('server-data').value = '';
    } catch (e) {
        alert('Fehler: Bitte gültige JSON-Daten eingeben!');
    }
});
// Funktion, um Daten von einem Server per API zu holen
async function fetchLiveServerData(ip) {
    try {
        const response = await fetch(`http://${ip}/stats`); // Abrufen der Server-Statistiken
        const data = await response.json();

        // Daten formatieren
        const formattedData = {
            server: `Live Server (${ip})`,
            metrics: [
                {
                    time: data.time,
                    cpu: data.cpu,
                    memory: data.memory,
                    disk: data.disk,
                    network: data.network
                }
            ]
        };

        return formattedData;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        alert(`Konnte die Daten von ${ip} nicht abrufen.`);
        return null;
    }
}

// Button für Live-Server hinzufügen
document.getElementById('add-live-server-button').addEventListener('click', async () => {
    const serverIp = document.getElementById('server-ip').value;

    if (!serverIp) {
        alert('Bitte eine gültige IP-Adresse eingeben.');
        return;
    }

    const liveServerData = await fetchLiveServerData(serverIp);
    if (liveServerData) {
        renderServer(liveServerData);
    }

    // Eingabefeld zurücksetzen
    document.getElementById('server-ip').value = '';
});
