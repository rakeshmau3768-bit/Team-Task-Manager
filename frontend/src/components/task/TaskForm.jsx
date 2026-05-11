import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useCreateTask } from "../../hooks/useTasks";

export default function TaskForm({ projectId, members = [], onClose }) {
  const { mutate: createTask, isPending } = useCreateTask();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    createTask({ projectId, data }, { onSuccess: onClose });
  };

  return (
    <Modal title="New Task" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Title" placeholder="Task title"
          error={errors.title?.message} {...register("title", { required: "Title is required" })} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task description..." {...register("description")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white" {...register("priority")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Assignee</label>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white" {...register("assignedTo")}>
              <option value="">Unassigned</option>
              {members.map(m => (
                <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
              ))}
            </select>
          </div>
        </div>
        <Input label="Due Date" type="date" {...register("dueDate")} />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}