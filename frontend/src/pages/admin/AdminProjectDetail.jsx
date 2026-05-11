import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "../../hooks/useProjects";
import {
  useAdminProjectTasks,
  useAddMemberToProject,
  useRemoveMemberFromProject,
  useCreateAdminTask,
  useAllUsers,
} from "../../hooks/useAdmin";
import KanbanBoard from "../../components/task/KanbanBoard";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { useForm } from "react-hook-form";

function AddMemberModal({ projectId, onClose }) {
  const { mutate: addMember, isPending } = useAddMemberToProject();
  const { data: allUsers } = useAllUsers();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    addMember(
      { projectId, data: { email: data.email, role: data.role } },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal title="Add Member to Project" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Select User
          </label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white"
            {...register("email", { required: "Please select a user" })}>
            <option value="">-- Select a user --</option>
            {allUsers?.map(user => (
              <option key={user._id} value={user.email}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white"
            {...register("role")}>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>Add Member</Button>
        </div>
      </form>
    </Modal>
  );
}

function CreateTaskModal({ projectId, members, onClose }) {
  const { mutate: createTask, isPending } = useCreateAdminTask();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    createTask({ projectId, data }, { onSuccess: onClose });
  };

  return (
    <Modal title="Create & Assign Task" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="Enter task title"
          error={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task description..."
            {...register("description")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Assign To</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white"
              {...register("assignedTo")}>
              <option value="">Unassigned</option>
              {members?.map(m => (
                <option key={m.user._id} value={m.user._id}>
                  {m.user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white"
              {...register("priority")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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

export default function AdminProjectDetail() {
  const { id } = useParams();
  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: tasks, isLoading: tasksLoading } = useAdminProjectTasks(id);
  const { mutate: removeMember } = useRemoveMemberFromProject();
  const [tab, setTab] = useState("board");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const handleRemoveMember = (memberId) => {
    removeMember({ projectId: id, memberId });
  };

  if (projectLoading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{project?.name}</h1>
          {project?.description && (
            <p className="text-sm text-gray-500 mt-0.5">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={tab === "board" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setTab("board")}>
            Board
          </Button>
          <Button
            variant={tab === "members" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setTab("members")}>
            Members ({project?.members?.length})
          </Button>
        </div>
      </div>

      {tab === "board" && (
        <>
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setShowCreateTask(true)}>
              + Assign Task
            </Button>
          </div>
          {tasksLoading
            ? <div className="flex justify-center py-10"><Spinner size="lg" /></div>
            : <KanbanBoard tasks={tasks || []} project={project} />
          }
        </>
      )}

      {tab === "members" && (
        <div>
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setShowAddMember(true)}>
              + Add Member
            </Button>
          </div>
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Member</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {project?.members?.map(m => (
                    <tr key={m.user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.user.name} src={m.user.avatar} size="sm" />
                          <span className="text-sm font-medium text-gray-800">
                            {m.user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.user.email}</td>
                      <td className="px-4 py-3"><Badge label={m.role} /></td>
                      <td className="px-4 py-3">
                        {project?.owner?._id !== m.user._id && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRemoveMember(m.user._id)}>
                            Remove
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {project?.members?.map(m => (
                <div key={m.user._id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.user.name} src={m.user.avatar} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{m.user.name}</p>
                        <p className="text-xs text-gray-500">{m.user.email}</p>
                      </div>
                    </div>
                    <Badge label={m.role} />
                  </div>
                  {project?.owner?._id !== m.user._id && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemoveMember(m.user._id)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </>
        </div>
      )}

      {showAddMember && (
        <AddMemberModal
          projectId={id}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          projectId={id}
          members={project?.members || []}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </div>
  );
}