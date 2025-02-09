
<script>
    import {
		PUBLIC_ICP_SERVER_URL,
		PUBLIC_ICP_ANON_KEY
	} from '$env/static/public';
    
	import { onMount } from 'svelte';
    import * as echarts from 'echarts';
    import Card, { Content } from '@smui/card';
    import CircularProgress from '@smui/circular-progress';

    // https://github.com/ecomfe/echarts-gl
    //import 'echarts-gl';
	import {getData} from '$lib/api.svelte';

    let chartElement;
    let dataCount = 10;
    let data = {
        categoryData: [],
        valueData: []
    };
    //let data = generateData(dataCount);
    //console.log('data', data);
    let loading = $state(true);
    let option;
    let myChart;


    onMount(() => {
        var chartDom = document.getElementById('chart');
        myChart = echarts.init(chartDom);
        
        getData('dp_dem', 
            {
                'select': 'k,date_start',
                'limit': 10000,
                'order': 'date_start.asc',
                'date_start': 'not.is.null'
            }
        ).then(remoteData => {
            for (let i = 0; i < remoteData.length; i++) {
                data.categoryData.push(echarts.format.formatTime('yyyy-MM-dd', remoteData[i].date_start, false));
                data.valueData.push(remoteData[i].k ? remoteData[i].k.toFixed(2) : (0).toFixed(2));
            }

            option = createOptions(data, 'dp_dem');
            myChart.setOption(option);

        }).finally(() => {
            loading = false;
        });
    });

    function createOptions(data, table='Data'){
        return {
            title: {
                text: `${echarts.format.addCommas(data.valueData.length)} ${table} in the dataset`,
                left: 10
            },
            toolbox: {
                feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                saveAsImage: {
                    pixelRatio: 2
                }
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'shadow'
                }
            },
            grid: {
                bottom: 90
            },
            dataZoom: [
                {
                type: 'inside'
                },
                {
                type: 'slider'
                }
            ],
            xAxis: {
                data: data.categoryData,
                silent: false,
                splitLine: {
                show: false
                },
                splitArea: {
                show: false
                }
            },
            yAxis: {
                splitArea: {
                show: false
                }
            },
            series: [
                {
                type: 'bar',
                data: data.valueData,
                // Set `large` for large data amount
                large: true
                }
            ]
        };
    }

    let innerWidth = $state(); // window.innerWidth
    function handleLeftResize() {
        myChart.resize();
    }
    $effect(() => {
        handleLeftResize(innerWidth);
    });
</script>

<svelte:window bind:innerWidth />

<div class="m-4">
    <Card>
        {#if loading}
            <CircularProgress indeterminate style="height: 32px; width: 32px;" />
        {/if}
        <div id="chart" class="chart" bind:this={chartElement} ></div>
    </Card>
</div>

<style>
    .chart {
        width: 100%;
        height: 400px;
    }
</style>