import { useEffect } from "react"

import { useTasks } from "../context/TasksContext"
import TaskCard from '../components/TaskCard'

const TasksPage = () => {
    const { getTasks, tasks } = useTasks()

    useEffect(() => {
        getTasks()
    }, [])

    const jsxml =
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {
                tasks.map(task => (
                    <TaskCard task={task} key={task._id} />
                ))
            }
        </div>

    return jsxml
}

export default TasksPage