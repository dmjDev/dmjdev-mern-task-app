import { useTasks } from "../context/TasksContext"
import { Link } from 'react-router-dom'
import { TextComponent } from "./TextComponent"

const TaskCard = ({ task }) => {
    const { deleteTask } = useTasks()

    const delProced = () => {
        const del = confirm(`¿Está seguro que desea eliminar la tarea ? \n ${task.title}`)
        del && deleteTask(task._id)
    }

    const jsxml = 
        <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
            <div className="flex gap-x-2 items-center">
                <a onClick={() => {
                    delProced()
                }} className="text-xl font-bold relative group text-cyan-700 transition-colors duration-300 cursor-pointer">
                    Delete
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-700 transition-all duration-300 group-hover:w-full"></span>
                </a><p className="text-sm">●</p>
                <Link to={`/tasks/${task._id}`} className="text-xl font-bold relative group text-cyan-700 transition-colors duration-300 cursor-pointer">
                    Edit
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-700 transition-all duration-300 group-hover:w-full"></span>
                </Link>
            </div>
            <h1 className="text-2x1 font-bold">{task.title}</h1>
            <p className="text-sm text-zinc-500">{new Date(task.date).toLocaleDateString()}</p>
            <TextComponent text={task.description} />
        </div>

    return jsxml
}

export default TaskCard