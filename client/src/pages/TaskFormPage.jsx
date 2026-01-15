import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

import { useTasks } from "../context/TasksContext"

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'; // Es importante añadir el .js en algunos entornos ESM
// Activar el plugin
dayjs.extend(utc);

const TaskFormPage = () => {
    const { tasks, getTasks, setTasks, createTask, getTask, updateTask } = useTasks()
    const { register, handleSubmit, setFocus, setValue, formState: { errors } } = useForm()
    const formularioRef = useRef(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getTasks()
    }, [])

    useEffect(() => {
        async function loadTask() {
            if (params.id) {
                const task = await getTask(params.id)
                setValue('title', task.title)
                setValue('description', task.description)
                setValue('date', dayjs.utc(task.date).format('YYYY-MM-DD'))
            } else {
                const hoy = new Date()
                const year = hoy.getFullYear()
                const month = String(hoy.getMonth() + 1).padStart(2, '0')
                const day = String(hoy.getDate()).padStart(2, '0')
                setValue('date', `${year}-${month}-${day}`)
                setValue('title', '')
                setValue('description', '')
            }
        }
        loadTask()
    }, [params])


    const onSubmit = handleSubmit(async (data) => {
        let taskDate = undefined
        data.date != '' && (taskDate = data.date)
        if (params.id) {
            await setTasks([])
            await updateTask(params.id, {
                ...data,
                date: dayjs.utc(taskDate).toISOString()
            })

            navigate('/tasks')
        } else {
            await setTasks([])
            await createTask({
                ...data,
                date: dayjs.utc(taskDate).toISOString()
            })

            formularioRef.current.reset()
            const hoy = new Date()
            const year = hoy.getFullYear()
            const month = String(hoy.getMonth() + 1).padStart(2, '0')
            const day = String(hoy.getDate()).padStart(2, '0')
            setValue('date', `${year}-${month}-${day}`)
            setFocus("title")
        }
        getTasks()
    })

    const jsxml =
        <div className="flex h-[calc(100vh-100px)] justify-center">
            <div className="bg-zinc-800 mr-1 max-w-md w-full p-10 rounded-md text-right text-sm text-zinc-500 overflow-y-auto max-h-[90vh]">
                {tasks.length === 0 ? (
                    <p>Empty tasks box</p>
                ) : (
                    [...tasks].reverse().map((task, index) => (
                        <p key={task.id || index}>
                            {`${task.title} - ${tasks.length - index}`}
                        </p>
                    ))
                )}
            </div>
            <div className="bg-zinc-800 ml-1 max-w-2/3 w-full p-10 rounded-md overflow-y-auto max-h-[90vh]">
                <h1 className="text-2xl font-bold">Add task</h1>
                <label htmlFor="title">Title{errors.title && (<span className='text-red-500'> : Required</span>)}</label>
                <form onSubmit={onSubmit} ref={formularioRef}>
                    <input
                        type="text"
                        id="title"
                        placeholder="The task title"
                        autoFocus
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        {...register('title', { required: true })}
                    />
                    <label htmlFor="description">Desciption</label>
                    <textarea
                        id="desciption"
                        cols="30"
                        rows="10"
                        placeholder="Describe the task"
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        {...register('description', { required: false })}
                    ></textarea>
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        {...register('date')}
                    />
                    <button
                        type="submit"
                        className='my-button-form'
                    >Save Task</button>
                </form>
            </div>
        </div>

    return jsxml
}

export default TaskFormPage
