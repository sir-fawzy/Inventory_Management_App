"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import { firestore } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { query, getDocs, collection, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }




  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  // Filter inventory based on search query (ADDED)
  const filteredInventory = searchQuery
    ? inventory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];



  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (

    <>
      <Box
        bgcolor="#05081c"
      >
        <Box bgcolor="white">
          {/* Search Bar */}
          <Box display="flex" justifyContent="center" marginTop={2}>
            <TextField
              label="Search Items" // (ADDED)
              variant="outlined" // (ADDED)
              // (ADDED)
              value={searchQuery} // (ADDED)
              onChange={(e) => setSearchQuery(e.target.value)} // (ADDED)
              style={{ width: '50%' }}
            /></Box>

          {/* Inventory List */}
          <Box display="flex" justifyContent="center" marginTop={2}>{filteredInventory.length > 0 ? (filteredInventory.map((item, index) => ( // Modified to use filteredInventory
            <Box key={index} >
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2">Quantity: {item.quantity}</Typography>
              <Button onClick={() => removeItem(item.name)}>Remove</Button>
            </Box>
          ))) : (
            <Typography variant="body2"></Typography> // Optionally display a message when no items match
          )}</Box>

          {/* Other components like Modal for adding items */}
          {/* ... */}
        </Box>
        <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2}>
          <Modal open={open} onClose={handleClose}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="white"
              border="2px solid  #000"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: "translate(-50% -50%)"
              }}
            >
              <Typography variant="h6"> Add Item</Typography>
              <Stack width="100%" dirction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }} />
                <button variant="outlined" onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}>Add</button>
              </Stack>
            </Box>
          </Modal>
          <Button
            variant="contained"
            onClick={() => {
              handleOpen();
            }}

          >
            Add New Item
          </Button>
          <Box border="1px solid #333">
            <Box
              width="800px"
              height="100px"
              bgcolor="#ADD8E6"
              display="flex"
              justifyContent="center"
            >
              <Typography variant="h2" color="#333">
                Inventory Items
              </Typography>
            </Box>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {inventory.map(({ name, quantity }) => (
              <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" padding={5}>
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}><Button variant="contained" onClick={() => {
                  addItem(name);
                }}>Add</Button>
                  <Button variant="contained" onClick={() => {
                    removeItem(name);
                  }}>Remove</Button></Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </>

  )
}
