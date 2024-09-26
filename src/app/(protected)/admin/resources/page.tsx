"use client";

import { IResource } from "@/app/models/Resource";
import { TableActions, TableGeneric } from "@/app/components/admin/Table";
import { DialogCustom } from "@/app/components/common/Dialog";
import { Select } from "@/app/components/common/Select";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn, handleOnChangeBasedOnName } from "@/app/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TableHeaders = [
  {
    title: "ID",
  },
  {
    title: "IP Address",
  },
  {
    title: "CPU",
  },
  {
    title: "GPU",
  },
  {
    title: "RAM",
  },
  {
    title: "Status",
  },
  {
    title: "Action",
  },
];

const Resource_Update_Dialouge_Initial_State = {
  _id: "",
  ip: "",
  cpu: "",
  gpu: "",
  ram: "",
  status: "",
  createdAt: new Date(),
  updatedAt: new Date(),
} satisfies IResource;

const page = () => {
  const [resources, setResources] = useState<Record<string, any>[]>([]);
  const [showResourceUpdateModal, setShowResourceUpdateModal] = useState(false);
  const [resourceBeingUpdated, setResourceBeingUpdated] = useState<IResource>(
    Resource_Update_Dialouge_Initial_State
  );

  const fetchResourcesData = async () => {
    try {
      const { data } = await axios.get("/api/resource");
      setResources(
        data.map((resource: IResource) => {
          return {
            id: resource._id,
            ip: resource.ip,
            cpu: resource.cpu,
            gpu: resource.gpu,
            ram: resource.ram,
            func_status: (resource: IResource) => {
              return (
                <p
                  className={cn("", {
                    "text-red-500": resource.status === "INACTIVE",
                    "text-green-500": resource.status === "ACTIVE",
                  })}
                >
                  {resource.status}
                </p>
              );
            },
            object_raw_data: resource,
          };
        })
      );
    } catch (error) {
      console.log(error, "Error at fetchResourcesData");
      toast.error("Failed to get resource");
    }
  };

  const updateResourceData = async () => {
    try {
      await axios.put("/api/resource", {
        resource_id: resourceBeingUpdated._id,
        updates: {
          ip: resourceBeingUpdated.ip,
          cpu: resourceBeingUpdated.cpu,
          gpu: resourceBeingUpdated.gpu,
          ram: resourceBeingUpdated.ram,
          status: resourceBeingUpdated.status,
        },
      });
      fetchResourcesData();
    } catch (error: any) {
      console.log(error, "Error at updateResourceData");
      toast.error(error.response.data.message || "Failed to update resource");
    }
  };

  useEffect(() => {
    fetchResourcesData();
  }, []);

  const actions = [
    {
      title: "Update",
      onClick: (resource: IResource) => {
        setShowResourceUpdateModal(true);
        setResourceBeingUpdated(resource);
      },
    },
  ];
  return (
    <>
      <div className="p-5">
        <h1 className="font-semibold text-2xl">Resources</h1>
        <TableGeneric
          caption={`Total available resources: ${resources.length}`}
          headers={TableHeaders}
          rows={resources.map((r) => ({
            ...r,
            actions: (data: IResource) => (
              <TableActions actions={actions} data={data} />
            ),
          }))}
        />
      </div>

      <DialogCustom
        title={`Update Resource`}
        description="Make changes to your resource here. Click save when you're done."
        submitBtnTitle="Save changes"
        open={showResourceUpdateModal}
        onClose={() => {
          setShowResourceUpdateModal(false);
          setResourceBeingUpdated(Resource_Update_Dialouge_Initial_State);
        }}
        onSubmit={updateResourceData}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resource_ip" className="text-right">
              IP Address
            </Label>
            <Input
              id="resource_ip"
              className="col-span-3"
              name="ip"
              value={resourceBeingUpdated.ip}
              onChange={(e) =>
                handleOnChangeBasedOnName(e, setResourceBeingUpdated)
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resource_cpu" className="text-right">
              CPU
            </Label>
            <Input
              id="resource_cpu"
              className="col-span-3"
              name="cpu"
              value={resourceBeingUpdated.cpu}
              onChange={(e) =>
                handleOnChangeBasedOnName(e, setResourceBeingUpdated)
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resource_gpu" className="text-right">
              GPU
            </Label>
            <Input
              id="resource_gpu"
              className="col-span-3"
              name="gpu"
              value={resourceBeingUpdated.gpu}
              onChange={(e) =>
                handleOnChangeBasedOnName(e, setResourceBeingUpdated)
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resource_ram" className="text-right">
              RAM
            </Label>
            <Input
              id="resource_ram"
              className="col-span-3"
              name="ram"
              type="number"
              value={+resourceBeingUpdated.ram.slice(0, -2)}
              onChange={(e) => {
                setResourceBeingUpdated((prev) => ({
                  ...prev,
                  ram: e.target.value + "GB",
                }));
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resource_status" className="text-right">
              Status
            </Label>
            <Select
              placeholer="Select the status"
              value={resourceBeingUpdated.status}
              label="Status"
              options={[
                { title: "Active", value: "ACTIVE" },
                { title: "InActive", value: "INACTIVE" },
              ]}
              onChange={(value) => {
                setResourceBeingUpdated((prev) => ({ ...prev, status: value }));
              }}
            />
          </div>
        </div>
      </DialogCustom>
    </>
  );
};

export default page;
