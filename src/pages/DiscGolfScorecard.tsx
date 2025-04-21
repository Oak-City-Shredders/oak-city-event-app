import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';

const SCORECARD_PARS = [3, 3, 3, 3, 3, 3, 3, 3, 3];

const DiscGolfScorecard: React.FC = () => {
  // Initialize state from localStorage or use default values
  const [players, setPlayers] = useState<string[]>(() => {
    const savedPlayers = localStorage.getItem('discGolfPlayers');
    return savedPlayers
      ? JSON.parse(savedPlayers)
      : ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
  });

  const [scores, setScores] = useState<Record<string, (number | null)[]>>(
    () => {
      const savedScores = localStorage.getItem('discGolfScores');
      if (savedScores) {
        return JSON.parse(savedScores);
      } else {
        // Default scores if nothing in localStorage
        return {
          'Player 1': Array(9).fill(null),
          'Player 2': Array(9).fill(null),
          'Player 3': Array(9).fill(null),
          'Player 4': Array(9).fill(null),
        };
      }
    }
  );

  const [selectedCell, setSelectedCell] = useState<{
    player: string;
    hole: number;
  } | null>(null);

  // Save players and scores to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('discGolfPlayers', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('discGolfScores', JSON.stringify(scores));
  }, [scores]);

  const updateScore = (player: string, hole: number, score: number | null) => {
    setScores({
      ...scores,
      [player]: scores[player].map((s, i) => (i === hole ? score : s)),
    });
  };

  const incrementScore = () => {
    if (selectedCell) {
      const { player, hole } = selectedCell;
      updateScore(player, hole, (scores[player][hole] ?? 0) + 1);
    }
  };

  const decrementScore = () => {
    if (selectedCell) {
      const { player, hole } = selectedCell;
      updateScore(player, hole, Math.max(0, (scores[player][hole] ?? 0) - 1));
    }
  };

  const clearScore = () => {
    // Reset to default players first
    const defaultPlayers = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

    // Create cleared scores using the default player names
    const clearedScores = defaultPlayers.reduce((acc, player) => {
      acc[player] = Array(9).fill(null);
      return acc;
    }, {} as Record<string, (number | null)[]>);

    // Set both states (order matters - scores must be updated first)
    setScores(clearedScores);
    setPlayers(defaultPlayers);
    setSelectedCell(null);

    // Clear the localStorage items
    localStorage.removeItem('discGolfScores');
    localStorage.removeItem('discGolfPlayers');
  };

  const updatePlayerName = (index: number, newName: string) => {
    const updatedPlayers = [...players];
    const oldName = updatedPlayers[index];
    updatedPlayers[index] = newName;

    const updatedScores = { ...scores };
    updatedScores[newName] = updatedScores[oldName];
    delete updatedScores[oldName];

    setPlayers(updatedPlayers);
    setScores(updatedScores);
  };

  return (
    <IonPage>
      <PageHeader title="Ferngully Disc Golf" />
      <IonContent>
        <IonGrid style={{ margin: '8px' }}>
          <IonRow>
            <IonCol
              className="header-align"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              size="1"
            >
              Hole
            </IonCol>
            <IonCol
              className="header-align"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              size="2"
            >
              Par
            </IonCol>
            {players.map((player, index) => (
              <IonCol key={index} className="header-align">
                <IonInput
                  value={player}
                  onIonChange={(e) => updatePlayerName(index, e.detail.value!)}
                />
              </IonCol>
            ))}
          </IonRow>
          {[...Array(9)].map((_, hole) => (
            <IonRow key={hole}>
              <IonCol className="fixed-width border" size="1">
                {hole + 1}
              </IonCol>
              <IonCol className="fixed-width border" size="2">
                {SCORECARD_PARS[hole]}
              </IonCol>
              {players.map((player) => (
                <IonCol
                  key={player}
                  className={`border ${
                    selectedCell?.player === player &&
                    selectedCell?.hole === hole
                      ? 'selected-cell'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedCell((prev) =>
                      prev?.player === player && prev?.hole === hole
                        ? null
                        : { player, hole }
                    )
                  }
                  style={{
                    backgroundColor:
                      selectedCell?.player === player &&
                      selectedCell?.hole === hole
                        ? 'var(--ion-color-primary)'
                        : 'transparent',
                  }}
                >
                  {scores[player][hole]}
                </IonCol>
              ))}
            </IonRow>
          ))}

          {/* Total Row */}
          <IonRow>
            <IonCol className="fixed-width border" size="1">
              T
            </IonCol>
            <IonCol className="fixed-width border" size="2">
              {SCORECARD_PARS.reduce((a, b) => a + b, 0)}
            </IonCol>
            {players.map((player) => {
              const totalScore =
                scores[player]?.reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0;
              const holesPlayed = scores[player].filter(
                (score) => score !== null
              ).length;
              const par = SCORECARD_PARS.slice(0, holesPlayed).reduce(
                (a, b) => a + b,
                0
              );
              const overall = totalScore - par;
              return (
                <IonCol key={player} className="border">
                  {totalScore} ({overall > 0 ? `+${overall}` : overall})
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>

        <IonRow className="ion-justify-content-center ion-margin-top">
          <IonButton style={{ width: '50px' }} onClick={incrementScore}>
            +
          </IonButton>
          <IonButton style={{ width: '50px' }} onClick={decrementScore}>
            -
          </IonButton>
        </IonRow>
        <IonRow className="ion-justify-content-center bottom-row">
          <IonButton expand="block" color="danger" onClick={clearScore}>
            Clear Scorecard
          </IonButton>
        </IonRow>
      </IonContent>

      <style>
        {`
          .fixed-width {
            width: 60px;
            text-align: center;
          }
          .header-align {
            text-align: center;
          }
          .border {
            border: 1px solid var(--ion-color-primary);
            text-align: center;
          }

          .bottom-row {
            position: absolute;
            bottom: 25px;
            width: 100%;
          }
        `}
      </style>
    </IonPage>
  );
};

export default DiscGolfScorecard;
