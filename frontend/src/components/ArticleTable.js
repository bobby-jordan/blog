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

const ArticleTable = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/articles")
      .then((response) => {
        setArticles(
          response.data.map((article) => ({
            ...article,
            id: article.ID,
          }))
        );
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`/articles/${id}`).then(() => {
      setArticles((prev) => prev.filter((article) => article.id !== id));
    });
  };

  const handleAddNew = () => {
    setSelectedArticle({
      id: "",
      title: "",
      image: "",
      author_id: "",
      subtitles: "",
      is_archived: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (id) => {
    axios
      .get(`/articles/${id}`)
      .then((response) => {
        const article = response.data;
        setSelectedArticle({
          id: article.ID || "",
          title: article.title || "",
          image: article.image || "",
          author_id: article.author_id || "",
          subtitles: article.subtitles || "",
          is_archived: article.is_archived || false,
        });
        setError("");
        setIsDialogOpen(true);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setError("Failed to fetch article details.");
      });
  };

  const handleSave = () => {
    if (selectedArticle) {
      const payload = {
        title: selectedArticle.title,
        image: selectedArticle.image,
        author_id: selectedArticle.author_id,
        subtitles: selectedArticle.subtitles,
        is_archived: selectedArticle.is_archived,
      };

      if (selectedArticle.id) {
        axios
          .put(`/articles/${selectedArticle.id}`, payload)
          .then((response) => {
            const updatedArticle = response.data;
            setArticles((prev) =>
              prev.map((article) =>
                article.id === updatedArticle.ID
                  ? { ...updatedArticle, id: updatedArticle.ID }
                  : article
              )
            );
            setIsDialogOpen(false);
            setSelectedArticle(null);
          })
          .catch((err) => {
            console.error("Error saving article:", err);
            setError("Failed to save article. Please check the input.");
          });
      } else {
        axios
          .post("/articles", payload)
          .then((response) => {
            const createdArticle = response.data;
            setArticles((prev) => [
              ...prev,
              { ...createdArticle, id: createdArticle.ID },
            ]);
            setIsDialogOpen(false);
            setSelectedArticle(null);
          })
          .catch((err) => {
            console.error("Error creating article:", err);
            setError("Failed to create article. Please check the input.");
          });
      }
    } else {
      console.error("No article selected for saving.");
      setError("No article selected for saving.");
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "16px" }}>
        <Tooltip title="Add New Article">
          <IconButton
            color="primary"
            onClick={handleAddNew}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              '&:hover': { backgroundColor: "#1565c0" },
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
              <TableCell>Title</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Author ID</TableCell>
              <TableCell>Subtitles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.id}</TableCell>
                <TableCell>{article.title}</TableCell>
                <TableCell>
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{ width: "100px" }}
                  />
                </TableCell>
                <TableCell>{article.author_id}</TableCell>
                <TableCell>{article.subtitles}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(article.id)}
                  >
                    View/Edit
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDelete(article.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for creating/editing an article */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {selectedArticle && selectedArticle.id
            ? "Edit Article"
            : "Add New Article"}
        </DialogTitle>
        <DialogContent>
  {selectedArticle && (
    <div>
      <TextField
        label="Title"
        value={selectedArticle.title}
        onChange={(e) =>
          setSelectedArticle({
            ...selectedArticle,
            title: e.target.value,
          })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Image URL"
        value={selectedArticle.image}
        onChange={(e) =>
          setSelectedArticle({
            ...selectedArticle,
            image: e.target.value,
          })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Author ID"
        value={selectedArticle.author_id}
        onChange={(e) =>
          setSelectedArticle({
            ...selectedArticle,
            author_id: parseInt(e.target.value, 10) || "",
          })
        }
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Subtitles"
        value={selectedArticle.subtitles}
        onChange={(e) =>
          setSelectedArticle({
            ...selectedArticle,
            subtitles: e.target.value,
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

export default ArticleTable;
