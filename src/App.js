import React from 'react';
import './App.css';
import List from './ListComponent';



const App = () => {

    const [showList, setShowList] = React.useState(false);

    const showHandler = () => {
        setShowList(state => !state);
    }


    return (
        <div className="App">
            {!showList ? 
            <button onClick={showHandler}>Mostrar Lista</button>
            : <List close={showHandler}/>
            }
        </div>
    );
}

export default App;
