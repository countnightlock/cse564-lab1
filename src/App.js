// App.js
import React, { Component } from 'react';
import './App.css';
import BarChart from './charts/BarChart';

import { fetchData } from './utils/file';

const datas = [
    [10, 30, 40, 20],
    [10, 40, 30, 20, 50, 10],
    [60, 30, 40, 20, 30]
]
var i = 0;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    async componentDidMount() {
        let data = await fetchData();
        this.setState({ data : data });
    }

    render() {
        let { data } = this.state;
        console.log("printing data");
        console.log(data);
        return (
            <div className="App">
                <p>
                    {JSON.stringify(data)}
                </p>
            </div>
        )
    }
}

// function App() {
//     const [data, setData] = useState([]);

//     setData(fetchData());
//     console.log(data);

//     useEffect(() => {
//         changeData();
//     }, []);

//     const changeData = () => {
//         setData(datas[i++]);
//         if(i === datas.length) i = 0;
//     }


//     return (
//         <div className="App">
//             <h2>Graphs with React</h2>
//             <button onClick={changeData}>Change Data</button>
//             <BarChart width={600} height={400} data={data} />
//         </div>
//     );
// }

export default App;
