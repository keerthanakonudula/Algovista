// Ensure the script runs only after the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('array-container');
    const startPage = document.getElementById('start-page');
    const mainApp = document.getElementById('main-app');
    let array = [];

    // 1. Transition Logic
    window.startApp = function() {
        startPage.classList.add('slide-up');
        setTimeout(() => {
            startPage.classList.add('hidden');
            mainApp.classList.remove('hidden');
            createNewArray(); // Generate bars once the app is visible
        }, 600);
    };

    // 2. Array Generation with Fixed Dimensions
    window.createNewArray = function() {
        container.innerHTML = '';
        array = [];
        const size = 40; 
        
        // Calculate width of each bar based on container size
        const totalWidth = container.offsetWidth;
        const barWidth = Math.floor(totalWidth / size) - 2;

        for (let i = 0; i < size; i++) {
            let val = Math.floor(Math.random() * 350) + 20;
            array.push(val);
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${val}px`;
            bar.style.width = `${barWidth}px`;
            container.appendChild(bar);
        }
    };

    // 3. Helper Functions
    const sleep = () => {
        const speed = document.getElementById('speed').value;
        return new Promise(resolve => setTimeout(resolve, 101 - speed));
    };

    // 4. Execution Controller
    window.runVisualization = async function() {
        const type = document.getElementById('algo-type').value;
        const bars = document.querySelectorAll('.bar');

        if (type === 'bubble') await bubbleSort(bars);
        else if (type === 'selection') await selectionSort(bars);
        else if (type === 'insertion') await insertionSort(bars);
        else if (type === 'quick') await quickSort(bars, 0, array.length - 1);
        else if (type === 'merge') await mergeSort(bars, 0, array.length - 1);
    };

    /* --- ALGORITHMS --- */

    async function bubbleSort(bars) {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                bars[j].style.background = 'red';
                if (array[j] > array[j + 1]) {
                    await sleep();
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    bars[j].style.height = `${array[j]}px`;
                    bars[j + 1].style.height = `${array[j + 1]}px`;
                }
                bars[j].style.background = '';
            }
            bars[array.length - i - 1].style.background = '#00ff88';
        }
    }

    async function selectionSort(bars) {
        for (let i = 0; i < array.length; i++) {
            let min = i;
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] < array[min]) min = j;
            }
            await sleep();
            [array[i], array[min]] = [array[min], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[min].style.height = `${array[min]}px`;
            bars[i].style.background = '#00ff88';
        }
    }

    async function insertionSort(bars) {
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                await sleep();
                array[j + 1] = array[j];
                bars[j + 1].style.height = `${array[j + 1]}px`;
                j--;
            }
            array[j + 1] = key;
            bars[j + 1].style.height = `${key}px`;
            bars[i].style.background = '#00ff88';
        }
    }

    async function quickSort(bars, start, end) {
        if (start >= end) return;
        let index = await partition(bars, start, end);
        await quickSort(bars, start, index - 1);
        await quickSort(bars, index + 1, end);
    }

    async function partition(bars, start, end) {
        let pivotValue = array[end];
        let pivotIndex = start;
        for (let i = start; i < end; i++) {
            if (array[i] < pivotValue) {
                await sleep();
                [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
                bars[i].style.height = `${array[i]}px`;
                bars[pivotIndex].style.height = `${array[pivotIndex]}px`;
                pivotIndex++;
            }
        }
        await sleep();
        [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
        bars[pivotIndex].style.height = `${array[pivotIndex]}px`;
        bars[end].style.height = `${array[end]}px`;
        return pivotIndex;
    }

    async function mergeSort(bars, l, r) {
        if (l >= r) return;
        let m = Math.floor((l + r) / 2);
        await mergeSort(bars, l, m);
        await mergeSort(bars, m + 1, r);
        await merge(bars, l, m, r);
    }

    async function merge(bars, l, m, r) {
        let left = array.slice(l, m + 1);
        let right = array.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            await sleep();
            if (left[i] <= right[j]) {
                array[k] = left[i];
                i++;
            } else {
                array[k] = right[j];
                j++;
            }
            bars[k].style.height = `${array[k]}px`;
            k++;
        }
        while (i < left.length) {
            await sleep();
            array[k] = left[i];
            bars[k].style.height = `${array[k]}px`;
            i++; k++;
        }
        while (j < right.length) {
            await sleep();
            array[k] = right[j];
            bars[k].style.height = `${array[k]}px`;
            j++; k++;
        }
    }
});
