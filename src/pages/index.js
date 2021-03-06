import React, { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Box, Button, makeStyles, TextField } from "@material-ui/core"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted"

const allTodos = gql`
  {
    allTodos {
      todo
      id
    }
  }
`

const addTodo = gql`
  mutation addTodo($todo: String!) {
    addTodo(todo: $todo) {
      todo
    }
  }
`

const deleteTodo = gql`
  mutation deleteTodo($id: String!) {
    discardTodo(id: $id) {
      id
    }
  }
`

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    marginTop: "100px",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}))

export default function Home() {
  const { loading, data, refetch } = useQuery(allTodos)
  const [createTodo, { loading: adding}] = useMutation(addTodo)
  const [discardTodo, { loading: deleting}] = useMutation(deleteTodo)
  const [todo, setTodo] = useState("")

  const handleSubmit = async () => {
    await createTodo({ variables: { todo } })
    await refetch()
  }

  const handleDelete = async id => {
    await discardTodo({ variables: { id } })
    await refetch()
  }

  const classes = useStyles()

  if (loading) {
    return <h1> ...laoding</h1>
  }

  return (
    <div className={classes.root}>
      <h1> Todo App Gatsby</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Box width="55%">
          <TextField
            fullWidth
            variant="outlined"
            label="Add todo"
            onChange={e => setTodo(e.target.value)}
          />
        </Box>
        <Button onClick={handleSubmit}>ADD</Button>
        {adding && <p style={{fontWeight : "bold"}}>adding data ...</p>}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}></Typography>
          <div className={classes.demo}>
            <List>
              {data.allTodos.map(item => {
                return (
                  <ListItem key={item.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <FormatListBulletedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText> {item.todo} </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => {handleDelete(item.id)}} >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })}
            </List>
            {deleting && <p style={{fontWeight : "bold"}}>removing data ...</p>}
          </div>
        </Grid>
      </div>
    </div>
  )
}
