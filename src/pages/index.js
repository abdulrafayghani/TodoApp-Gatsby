import React, { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Box, Button, makeStyles, TextField } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const allTodos = gql`
  {
    allTodos {
      todo: String
      id: String
    }
  }
`

const addTodo = gql`
  mutation addTodo($id: String) {
    addTodo(id: $id) {
      todo
    }
  }
`

const deleteTodo = gql`
  mutation deleteTodo($id: String) {
    discardTodo(id: $id) {
      id
    }
  }
`

const useStyles = makeStyles((theme) => ({
  root: {
    // width: '100%'
    // display: 'flex',
    textAlign:'center',
    marginTop:'100px'    

  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

export default function Home() {
  const { loading, error, data, refetch } = useQuery(allTodos)
  const [createTodo, reg] = useMutation(addTodo)
  const [discardTodo] = useMutation(deleteTodo)

  const [todo, setTodo] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    await createTodo({ variables: { todo } })
    await refetch()
  }

  const handleDelete = async id => {
    await discardTodo({ variables: { todo: id } })
    await refetch()
  }

  function generate(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);


  return (
    <div className={classes.root}>
      <div style={{ display:'flex', justifyContent:'center'  }}>
        <Box width='55%' > 
          <TextField fullWidth variant='outlined' label="Add todo" onChange={(e) => setTodo(e.target.value)} /> 
          </Box>
          <Button >ADD</Button> 
    </div>
    <div style={{ display:'flex', justifyContent:'center'}} >
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes.title}>
        </Typography>
        <div className={classes.demo}>
          <List dense={dense}>
            {generate(
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Single-line item"
                  secondary={secondary ? "Secondary text" : null}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </List>
        </div>
      </Grid>
      </div>
    </div>
  )
}
