'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Grid, Paper, Container } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    updateInventory();
    document.title = "Pantry Tracker";
  }, []);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id, 
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!item) return; // Check if itemName is not empty

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    
    await updateInventory();
  };

  const removeItem = async (item) => {
    if (!item) return; // Check if itemName is not empty

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = inventory.map(item => ({
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    value: item.quantity,
  }));

  const COLORS = ['#a4c639', '#6d6e6f', '#f2b5d4', '#d6a4a4', '#d1c5b1', '#c2b69d'];

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      padding={2}
      sx={{ backgroundColor: '#f4f1e9', fontFamily: '"Roboto", sans-serif' }} // Beige background color
    > 
      <Container>
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ mb: 4, color: '#4a5d23', fontFamily: '"Lora", serif' }} // Olive green color and sophisticated font
        >
          Aishah's Pantry Tracker
        </Typography>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4} // Space between search and title
        >
          <TextField
            label="Search Items"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ marginRight: 2, fontFamily: '"Roboto", sans-serif' }}
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpen}
            sx={{
              zIndex: 1200, // Ensure the button is above other content
              backgroundColor: '#a4c639', // Olive green button color
              '&:hover': {
                backgroundColor: '#8a9a5b',
              },
              fontFamily: '"Roboto", sans-serif'
            }}
          >
            Add New Item
          </Button>
        </Box>
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
          <Box
            width="100%"
            height="100px"
            bgcolor="#4a5d23" // Dark olive green
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={2}
          >
            <Typography variant={'h4'} color={'#f4f1e9'} textAlign={'center'} fontFamily='"Lora", serif'>
              Inventory Items
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {filteredInventory.map(({ name, quantity }) => (
              <Grid item xs={12} sm={6} key={name}>
                <Paper elevation={1} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant={'h5'} color={'#4a5d23'} textAlign={'center'} fontFamily='"Lora", serif'>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h6'} color={'#4a5d23'} textAlign={'center'} sx={{ marginBottom: 2 }}>
                    Quantity: {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={() => addItem(name)} sx={{ backgroundColor: '#a4c639', fontFamily: '"Roboto", sans-serif' }}>
                      Add
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => removeItem(name)} sx={{ backgroundColor: '#d6a4a4', fontFamily: '"Roboto", sans-serif' }}>
                      Remove
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" color="#4a5d23" textAlign="center" gutterBottom fontFamily='"Lora", serif'>
            Inventory Quantities
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Container>
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          p: 2,
          bgcolor: '#4a5d23', // Dark olive green
          color: '#f4f1e9', // Beige text color
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          © Aishah Pervaiz 2024
        </Typography>
        <Typography variant="body2">
          Design: Built with React.js, Next.js, Material UI, and Firebase
        </Typography>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            zIndex: 1300, // Ensure the modal is above other content
          }}
        >
          <Typography variant="h6" fontFamily='"Lora", serif'>
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ fontFamily: '"Roboto", sans-serif' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{ backgroundColor: '#a4c639', fontFamily: '"Roboto", sans-serif' }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}







