import { useState, useEffect } from 'react';
import './App.css';
    
 // Definimos un tipo para los datos de la habitación para mayor seguridad de tipos
    interface Room {
       id: number;
       name: string;
       description: string;
       capacity: number;
      price: number;
    }
  
    function App() {
      const [rooms, setRooms] = useState<Room[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
   
      useEffect(() => {
        const fetchRooms = async () => {
          try {
            // Usamos la variable de entorno que definimos en .env
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/rooms`;
            console.log(`Fetching rooms from: ${apiUrl}`);
   
            const response = await fetch(apiUrl);
   
            if (!response.ok) {
              throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
   
            const data: Room[] = await response.json();
            setRooms(data);
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
               setError('An unknown error occurred');
            }
          } finally {
            setLoading(false);
          }
        };
   
        fetchRooms();
     }, []); // El array vacío asegura que esto se ejecute solo una vez
   
      return (
        <>
          <h1>BookFrontera</h1>
          <h2>Lista de Habitaciones desde la API</h2>
          {loading && <p>Cargando habitaciones...</p>}
          {error && <p style={{ color: 'red' }}>Error al cargar: {error}</p>}
          {rooms.length > 0 && (
            <div className="card-container">
              {rooms.map((room) => (
                <div className="card" key={room.id}>
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                  <p>Capacidad: {room.capacity}</p>
                  <p>Precio: ${room.price}</p>
                </div>
              ))}
            </div>
          )}
        </>
      );
   }
   
 export default App;