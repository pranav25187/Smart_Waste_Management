import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from './config';
import axios from "axios";
import InventoryIcon from '@mui/icons-material/Inventory';

import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem, 
  Button, 
  InputAdornment,
  CircularProgress,
  Paper,
  Avatar
} from "@mui/material";
import { 
  AddPhotoAlternate, 
  Scale, 
  Description, 
  LocationOn, 
  Event, 
  AttachMoney 
} from "@mui/icons-material";

const PostWaste = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    material_name: "",
    material_category: "",
    quantity: "",
    unit: "kg",
    condition_status: "good",
    description: "",
    price: "",
    location: "",
    available_date: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const conditions = [
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  const categories = [
    "Plastic",
    "Metal",
    "Electronic",
    "Glass",
    "Paper",
    "Textile",
    "Organic",
    "Chemical",
    "Construction",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            if (image) {
                formDataToSend.append("image", image);
            }

            const response = await axios.post(
                `${API_BASE_URL}/api/posts`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                navigate("/home/materials");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post material");
        } finally {
            setLoading(false);
        }
    };

      if (response.status === 201) {
        navigate("/home/materials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          <AddPhotoAlternate color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Post Waste Material
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Material Name"
            name="material_name"
            value={formData.material_name}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InventoryIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            label="Material Category"
            name="material_category"
            value={formData.material_category}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Scale color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="ton">ton</MenuItem>
              <MenuItem value="g">grams</MenuItem>
              <MenuItem value="lb">pounds</MenuItem>
            </TextField>
          </Box>

          <TextField
            select
            fullWidth
            label="Condition"
            name="condition_status"
            value={formData.condition_status}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          >
            {conditions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="number"
            label="Price (₹)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="date"
            label="Available Date"
            name="available_date"
            value={formData.available_date}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Event color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            component="label"
            startIcon={<AddPhotoAlternate />}
            sx={{ mb: 3 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>

          {image && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2">Selected: {image.name}</Typography>
              <Avatar
                src={URL.createObjectURL(image)}
                variant="rounded"
                sx={{ width: 100, height: 100, mt: 1 }}
              />
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : "Post Material"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostWaste;
