import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  Edit,
  Delete,
  ExpandMore,
  Inventory,
  Place,
  AttachMoney,
  Event,
  Scale,
  Person
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ExpandMoreButton = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const MaterialsPage = ({ isMyMaterials = false }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
const fetchMaterials = async () => {
        try {
            console.log("Calling /api/posts/my...");
            const response = await axios.get(`${API_BASE_URL}/api/posts/my`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Received materials:", response.data);
            setMaterials(response.data);
        } catch (err) {
            console.error("Error fetching materials:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to fetch materials");
        } finally {
            setLoading(false);
        }
    };




  useEffect(() => {
    console.log("Token from localStorage:", token); // ✅ Debug

    if (!token && isMyMaterials) {
      navigate('/login');
      return;
    }

    fetchMaterials();
  }, [isMyMaterials]);


  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEdit = (postId) => {
    navigate(`/home/edit-post/${postId}`);
  };
 const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMaterials();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete post');
        }
    };
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {isMyMaterials ? 'My Posted Materials' : 'Browse Materials'}
      </Typography>

      {materials.length === 0 ? (
        <Typography variant="body1">No materials found.</Typography>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3
        }}>
          {materials.map((material) => (
            <Card key={material.post_id} sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {isMyMaterials ? <Inventory /> : <Person />}
                  </Avatar>
                }
                title={material.material_name}
                subheader={
                  isMyMaterials
                    ? `Posted on ${new Date(material.created_at).toLocaleDateString()}`
                    : `Posted by ${material.user_name}`
                }
                action={
                  <Box>
                    <IconButton onClick={() => handleEdit(material.post_id)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(material.post_id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                }
              />
              <CardMedia
                component="img"
                height="194"
                image={`http://localhost:5000${material.image_path}`}
                alt={material.material_name}
              />

              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip
                    label={material.material_category}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="h6" color="text.secondary">
                    ₹{material.price}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Place fontSize="small" color="action" />
                  <Typography variant="body2">{material.location}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Scale fontSize="small" color="action" />
                  <Typography variant="body2">
                    {material.quantity} {material.unit}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions disableSpacing>
                <ExpandMoreButton
                  expand={expandedId === material.post_id}
                  onClick={() => handleExpandClick(material.post_id)}
                  aria-expanded={expandedId === material.post_id}
                  aria-label="show more"
                >
                  <ExpandMore />
                </ExpandMoreButton>
              </CardActions>

              <Collapse in={expandedId === material.post_id} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph sx={{ fontWeight: 'bold' }}>
                    Details:
                  </Typography>
                  <Typography paragraph>
                    <strong>Condition:</strong> {material.condition_status}
                  </Typography>
                  <Typography paragraph>
                    <strong>Available:</strong> {new Date(material.available_date).toLocaleDateString()}
                  </Typography>
                  <Typography paragraph>
                    <strong>Description:</strong> {material.description || 'No description provided'}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MaterialsPage;
