import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartmentById,
  createDepartment,
  updateDepartment,
  type Department,
} from "../services/departmentService";
import type { ApiError } from "../types/error";

const DepartmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<Partial<Department>>({
    name: "",
    status: "active",
  });

  const { data: department, isLoading } = useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        status: department.status,
      });
    }
  }, [department]);

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      navigate("/departments");
    },
    onError: (error: ApiError) => {
      console.error("Error creating department:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create department. Please check your input."
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", id] });
      navigate("/departments");
    },
    onError: (error: ApiError) => {
      console.error("Error updating department:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update department. Please check your input."
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.status) {
      setError("Please fill in all required fields");
      return;
    }

    if (isEditing && id) {
      const { id, ...updateData } = formData as Department;
      updateMutation.mutate({
        id: Number(id),
        ...updateData,
      });
    } else {
      createMutation.mutate(formData as Department);
    }
  };

  if (isEditing && isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? "Edit Department" : "Add Department"}
        </h2>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        {(createMutation.isError || updateMutation.isError) && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {createMutation.error?.message ||
              updateMutation.error?.message ||
              "An error occurred"}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/departments")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
