import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import questList from "../data/quests.json";

const QuestsPage = () => {
  const [quests, setQuests] = useLocalStorage("quests", questList);

  const toggleQuestCompletion = (id) => {
    setQuests(
      quests.map((quest) =>
        quest.id === id ? { ...quest, completed: !quest.completed } : quest
      )
    );
  };

  return (
    <Container>
      <Breadcrumb name={"Quests"} />
      <Card>
        <CardMedia
          component="img"
          sx={{
            height: {
              xs: 225,
              sm: 300,
              md: 400,
            },
          }}
          image="/images/quests-small.webp"
          alt="Quests"
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Quests
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "24px" }}>
            {quests.map((quest) => (
              <div key={quest.id} style={{ marginBottom: "10px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      checked={quest.completed}
                      tabIndex={-1}
                      color="success"
                      onChange={() => toggleQuestCompletion(quest.id)}
                    />
                  }
                  label={quest.text}
                />
              </div>
            ))}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QuestsPage;
