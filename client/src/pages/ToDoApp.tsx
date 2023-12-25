import axios from "axios";
import { useState, useEffect, Component } from "react";


export function ToDoApp() {
    const [isClick, setIsClick] = useState()
    const [taskData, setTaskData] = useState([])

    const handleGetAll = async () => {
        console.log('bbbbbb');
        
        try {
            const response = await axios.get('/hello-world')
            const tasks = response.data
            console.log("aaaaaaaa",tasks)
            setTaskData(tasks)
        } catch (error) {
            console.log("Errorrrrrrrrrrrrrrr: ", error)
        }   
    }
    

    return (
        <div>
            <form>
                <h2>Danh sach cong viec</h2>
                <button onClick = {handleGetAll} >aaaaaaaa</button>
                <ul>
                    {Array.isArray(taskData) && taskData.map((task:any, index:number) => (
                        <li key={index} > {task.name} </li>
                    ))}
                </ul>
            </form>
        </div>
    )
}

