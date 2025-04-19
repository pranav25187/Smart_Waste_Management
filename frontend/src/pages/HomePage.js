// frontend/src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Container,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  Person,
  Place,
  AttachMoney,
  Scale,
  Event,
  Inventory
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

export default function HomePage() {
  const [materials, setMaterials] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        if (!token || !user) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/posts/others`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMaterials(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch materials');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [navigate, token, user]);

  const handleExpandClick = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  const handleContact = (sellerId, postId) => {
    navigate('/home/chats', {
      state: {
        chatData: {
          material_id: postId,
          buyer_id: user.user_id,
          seller_id: sellerId
        }
      }
    });
  };

  const handleBuy = (post) => {
    navigate('/home/buy', { state: { post } });
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
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Available Materials
      </Typography>

      {materials.length === 0 ? (
        <Typography variant="body1">No materials available.</Typography>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3
        }}>
          {materials.map((material) => (
            <Card key={material.post_id}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                }
                title={material.material_name}
                subheader={`Posted by ${material.user_name}`}
              />

              {material.image_path && (
                <CardMedia
                  component="img"
                  height="194"
                  image={`${process.env.REACT_APP_API_BASE_URL}${material.image_path}`}
                  alt={material.material_name}
                />
              )}

              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip
                    label={material.material_category}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="h6" color="text.secondary">
                    ${material.price}
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
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleBuy(material)}
                >
                  Buy
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleContact(material.user_id, material.post_id)}
                >
                  Contact
                </Button>
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
    </Container>
  );
}
