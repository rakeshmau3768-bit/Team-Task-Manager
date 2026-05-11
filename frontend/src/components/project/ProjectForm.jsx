import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useCreateProject } from "../../hooks/useProjects";

export default function ProjectForm({ onClose, createMutation }) {
  const defaultMutation = useCreateProject();
  const { mutate: createProject, isPending } = createMutation || defaultMutation;
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    createProject(data, { onSuccess: onClose });
  };

  return (
    <Modal title="New Project" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Project Name" placeholder="My Awesome Project"
          error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea rows={3} placeholder="What is this project about?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("description")} />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>Create Project</Button>
        </div>
      </form>
    </Modal>
  );
}