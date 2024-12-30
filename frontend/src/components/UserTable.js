import React, { useEffect, useState } from "react";
import axios from "../services/api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`/users/${id}`).then(() => {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    });
  };

  const handleAddNew = () => {
    setSelectedUser({
      id: "",
      username: "",
      email: "",
      user_role: "",
      date_created: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (id) => {
    axios
      .get(`/users/${id}`)
      .then((response) => {
        setSelectedUser(response.data);
        setError("");
        setIsDialogOpen(true);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user details.");
      });
  };

  const handleSave = () => {
    if (selectedUser) {
      const payload = {
        username: selectedUser.username,
        email: selectedUser.email,
        user_role: selectedUser.user_role,
      };

      if (selectedUser.id) {
        axios
          .put(`/users/${selectedUser.id}`, payload)
          .then((response) => {
            const updatedUser = response.data;
            setUsers((prev) =>
              prev.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              )
            );
            setIsDialogOpen(false);
            setSelectedUser(null);
          })
          .catch((err) => {
            console.error("Error saving user:", err);
            setError("Failed to save user. Please check the input.");
          });
      } else {
        axios
          .post("/users", payload)
          .then((response) => {
            setUsers((prev) => [...prev, response.data]);
            setIsDialogOpen(false);
            setSelectedUser(null);
          })
          .catch((err) => {
            console.error("Error creating user:", err);
            setError("Failed to create user. Please check the input.");
          });
      }
    } else {
      console.error("No user selected for saving.");
      setError("No user selected for saving.");
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "16px" }}>
        <Tooltip title="Add New User">
          <IconButton
            color="primary"
            onClick={handleAddNew}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>User Role</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_role}</TableCell>
                <TableCell>
                  {new Date(user.date_created).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(user.id)}
                  >
                    View/Edit
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for creating/editing a user */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {selectedUser && selectedUser.id ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div>
              <TextField
                label="Username"
                value={selectedUser.username}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    username: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    email: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="User Role"
                value={selectedUser.user_role}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    user_role: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;
