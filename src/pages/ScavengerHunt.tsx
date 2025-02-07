import React from "react";
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonList, IonItem, IonLabel } from "@ionic/react";
import { IonPage, IonHeader, IonToolbar, IonTitle } from "@ionic/react";

const ScavengerHunt: React.FC = () => {
  return (
    <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Scavenger Hunt</IonTitle>
            </IonToolbar>
          </IonHeader>
    <IonContent>
      <IonCard>
        <img
          src="/images/scavenger-hunt.webp"
          alt="Scavenger Hunt"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "400px", // Adjust based on your desired max height
            objectFit: "cover",
          }}
        />
        <IonCardContent>
          <p>
            Starting bright and early Thursday morning, the Scavenger Hunt kicks
            off and runs until the awards ceremony Saturday evening. Whether
            you’re a seasoned hunter or a first-timer, this is your chance to
            explore the entire property in search of hidden treasures!
          </p>

          <IonCardSubtitle>🎁 Prizes:</IonCardSubtitle>
          <p>
            Prizes include awesome gear like ElectroLytes, WTF Rails, Function
            Wrist Guards, an MTE Hub, gift cards, rail guards, fenders, and swag
            bags packed with goodies!
          </p>

          <IonCardSubtitle>🌳 Where to Look:</IonCardSubtitle>
          <p>
            The squirrels are scattered everywhere! From the Float Track to
            Stoke Park, and even down by the lake, you’ll need your wits, eyes,
            and maybe a little luck to find them all.
          </p>

          <IonCardSubtitle>🎨 What to Look For:</IonCardSubtitle>
          <p>
            There are three different squirrel colors, each with unique prizes:
          </p>
          <IonList>
            <IonItem>
              <IonLabel>
                🟢 Green Squirrels: Win exciting prizes worth $50+ from Onewheel
                vendors!
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                🟡 Gold Squirrels: Score the big stuff with prizes valued at
                $150+!
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                🟣 Purple Squirrels: The real competition! The person who collects
                the most purple squirrels will snag an exclusive prize.
              </IonLabel>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>
    </IonContent>
    </IonPage>
  );
};

export default ScavengerHunt;
