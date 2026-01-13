import { Router } from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import { getTasks, getTask, createTask, deleteTask, updateTask } from '../controllers/tasks.controller.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js'

const router = Router()

const func = () => {}

router.get('/tasks', authRequired, getTasks)
router.get('/tasks/:id', authRequired, getTask)
router.post('/tasks', authRequired, validateSchema(createTaskSchema), createTask)
router.delete('/tasks/:id', authRequired, deleteTask)
router.put('/tasks/:id', authRequired, validateSchema(updateTaskSchema), updateTask)

export default router
