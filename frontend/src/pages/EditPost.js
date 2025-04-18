import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
  Avatar,
  InputAdornment
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  Event as DateIcon,
  AttachMoney as PriceIcon,
  Scale as ScaleIcon,
  AddPhotoAlternate
} from '@mui/icons-material';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    material_name: '',
    material_category: '',
    quantity: '',
    unit: 'kg',
    condition_status: 'good',
    description: '',
    price: '',
    location: '',
    available_date: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const categories = [
    "Plastic", "Metal", "Electronic", "Glass",
    "Paper", "Textile", "Organic", "Chemical",
    "Construction", "Other"
  ];

  const conditions = [
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" }
  ];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const post = response.data;
        setFormData({
          material_name: post.material_name,
          material_category: post.material_category,
          quantity: post.quantity,
          unit: post.unit,
          condition_status: post.condition_status,
          description: post.description,
          price: post.price,
          location: post.location,
          available_date: post.available_date.split('T')[0] // Format date for date input
        });
        
        if (post.image_path) {
          setImagePreview(`http://localhost:5000${post.image_path}`);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (image) {
        formDataToSend.append("image", image);
      }
      
      await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      navigate('/home/materials');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.material_name) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Edit Material Post
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
                    <ScaleIcon color="action" />
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
                  <DescriptionIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label="Price (R)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PriceIcon color="action" />
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
                  <LocationIcon color="action" />
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
                  <DateIcon color="action" />
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
            Upload New Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          
          {imagePreview && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2">Image Preview:</Typography>
              <Avatar
                src={imagePreview}
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
            {loading ? <CircularProgress size={24} /> : "Update Post"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPost;