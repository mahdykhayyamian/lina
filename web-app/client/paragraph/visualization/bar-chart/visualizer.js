import { parseBarChartCommands } from './command-parser'
import { Chart } from 'chart.js'

function visualizeBoardCommands(board) {
    const { commands, rootElement } = board
    const barChartIR = parseBarChartCommands(commands)

    // clean the board
    while (rootElement.firstChild) {
        rootElement.firstChild.remove()
    }

    const barChartCanvas = document.createElement('canvas')
    rootElement.appendChild(barChartCanvas)

    for (const chartId in barChartIR) {
        const labels = barChartIR[chartId].data.map(tuple => tuple[0])
        const data = barChartIR[chartId].data.map(tuple => tuple[1])

        var myChart = new Chart(barChartCanvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: barChartIR[chartId].title,
                        data,
                        borderWidth: 1,
                        backgroundColor: barChartIR[chartId].color,
                    },
                ],
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            },
        })
    }
}

const visualizer = {
    visualizeBoardCommands,
}

export { visualizer }
