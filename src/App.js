// App.js
import React, { Component } from 'react';
import './App.css';
import BarChart from './charts/BarChart';

import { fetchData } from './utils/file';

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
        return (
            <div className="App">
                <h4>Key (Frequencies)</h4>
                <BarChart data={this.state.data} dimension="key" sortFunction={(d) => (+d["key"])}/>
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
