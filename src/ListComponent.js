import React from 'react';

const ListItem = ({id, nombre, imageUrl}) => {

    return <div >
        <p>{nombre}</p>
        <img src={`http://localhost:3001${imageUrl}`} alt="avatar de usuario"/>
    </div>

}

const ListComponent = ({close}) => {

    const [users, setUsers] = React.useState([]);


    React.useEffect(() => {
        fetch('http://localhost:3001/data', {method:'get'})
            .then(resp => {
                if(resp.status === 200){
                    return resp.json();
                }
                throw new Error('EL statusCode no es 200')
            })
            .then(data => {
                setUsers(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])


    return (<>
        <div>
            {users.map(user => {
                return <ListItem key={user.id} nombre={user.name} imageUrl={user.src} />
            })}
        </div>
        <button onClick={close}>Cerrar</button>
    </>);

}
export default ListComponent;