"use client";

import { useEffect, useState } from "react";
import { AddSchoolDialog } from "@/components/admin/AddSchoolDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { School } from "lucide-react";

interface SchoolType {
  id: string;
  name: string;
  code: string;
  email: string;
  city: string;
  state: string;
  subscriptionStatus: string;
  createdAt: string;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/schools`,
        {
           headers: {
            Authorization: `Bearer ${token}`
           }
        }
      );
      setSchools(response.data.data);
    } catch (error) {
      console.error("Failed to fetch schools", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
          <p className="text-muted-foreground">
            Manage registered schools and their subscriptions.
          </p>
        </div>
        <AddSchoolDialog onSuccess={fetchSchools} />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading schools...
                </TableCell>
              </TableRow>
            ) : schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No schools found. Add a school to get started.
                </TableCell>
              </TableRow>
            ) : (
              schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.code}</TableCell>
                  <TableCell>{school.name}</TableCell>
                  <TableCell>
                    {school.city}, {school.state}
                  </TableCell>
                  <TableCell>{school.email}</TableCell>
                  <TableCell>
                    <Badge variant={school.subscriptionStatus === "active" ? "default" : "secondary"}>
                      {school.subscriptionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(school.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
