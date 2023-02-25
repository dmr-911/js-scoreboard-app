// Define Redux action types
const INCREMENT_SCORE = "INCREMENT_SCORE";
const DECREMENT_SCORE = "DECREMENT_SCORE";
const RESET_SCORE = "RESET_SCORE";
const ADD_MATCH = "ADD_MATCH";
const DELETE_MATCH = "DELETE_MATCH";

// Define Redux action creators
function incrementScore(matchIndex, incrementAmount) {
  return {
    type: INCREMENT_SCORE,
    matchIndex,
    incrementAmount,
  };
}

function decrementScore(matchIndex, decrementAmount) {
  return {
    type: DECREMENT_SCORE,
    matchIndex,
    decrementAmount,
  };
}

function resetScore() {
  return {
    type: RESET_SCORE,
  };
}

function addMatch() {
  return {
    type: ADD_MATCH,
  };
}

function deleteMatch(matchIndex) {
  return {
    type: DELETE_MATCH,
    matchIndex,
  };
}

// Define initial state
const initialState = {
  matches: [
    {
      name: "Match 1",
      score: 0,
    },
  ],
};

// Define Redux reducer
function scoreboardReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT_SCORE:
      return {
        ...state,
        matches: state.matches.map((match, index) => {
          if (index === action.matchIndex) {
            return {
              ...match,
              score: match.score + action.incrementAmount,
            };
          }
          return match;
        }),
      };
    case DECREMENT_SCORE:
      return {
        ...state,
        matches: state.matches.map((match, index) => {
          if (index === action.matchIndex) {
            const newScore = match.score - action.decrementAmount;
            return {
              ...match,
              score: newScore >= 0 ? newScore : 0,
            };
          }
          return match;
        }),
      };
    case RESET_SCORE:
      return {
        ...state,
        matches: state.matches.map((match) => ({
          ...match,
          score: 0,
        })),
      };
    case ADD_MATCH:
      return {
        ...state,
        matches: [
          ...state.matches,
          { name: `Match ${state.matches.length + 1}`, score: 0 },
        ],
      };
    case DELETE_MATCH:
      console.log(action.matchIndex);
      return {
        ...state,
        matches: state.matches.filter(
          (match, index) => index !== action.matchIndex
        ),
      };

    default:
      return state;
  }
}

// Create Redux store
const store = Redux.createStore(scoreboardReducer);

// Select DOM elements
const incrementForms = document.querySelectorAll(".incrementForm");
const decrementForms = document.querySelectorAll(".decrementForm");
const deleteButtons = document.querySelectorAll(".lws-delete");
const addMatchButton = document.querySelector(".lws-addMatch");
const resetButton = document.querySelector(".lws-reset");

// Define event handlers
function handleIncrementFormSubmit(event) {
  event.preventDefault();
  const matchIndex = getMatchIndex(event.target);
  const incrementAmount = parseInt(
    event.target.querySelector(".lws-increment").value
  );
  store.dispatch(incrementScore(matchIndex, incrementAmount));
  console.log(matchIndex, incrementAmount);
}

function handleDecrementFormSubmit(event) {
  event.preventDefault();
  const matchIndex = getMatchIndex(event.target);
  const decrementAmount = parseInt(
    event.target.querySelector(".lws-decrement").value
  );
  store.dispatch(decrementScore(matchIndex, decrementAmount));
}

function handleDeleteButtonClick(event) {
  const matchIndex = getMatchIndex(event.target);
  removeMatchFromDOM(matchIndex);
  store.dispatch(deleteMatch(matchIndex));
}

function handleAddMatchButtonClick() {
  addMatchToDOM();
  store.dispatch(addMatch());
  console.log(store.getState());
}

function handleResetButtonClick() {
  store.dispatch(resetScore());
}

// Helper function to get the index of the parent match element
function getMatchIndex(element) {
  const matchElement = element.closest(".match");
  return Array.from(matchElement.parentNode.children).indexOf(matchElement);
}

// Subscribe to store updates and update the DOM accordingly
function render() {
  const { matches } = store.getState();
  // console.log(matches);
  const scoreDisplays = document.querySelectorAll(".lws-singleResult");
  scoreDisplays.forEach((display, index) => {
    display.textContent = matches[index]?.score;
  });
}

// Adding match to the DOM
function addMatchToDOM() {
  const matches = store.getState().matches;
  const matchesContainer = document.querySelector(".all-matches");
  const matchElement = document.createElement("div");
  matchElement.className = "match";
  matchElement.innerHTML = `
  <div class="wrapper">
    <button class="lws-delete" onclick="handleDeleteButtonClick(event)">
      <img src="./image/delete.svg" alt="" />
    </button>
    <h3 class="lws-matchName">Match ${matches.length + 1}</h3>
  </div>
  <div class="inc-dec">
    <form
      class="incrementForm"
      onsubmit="handleIncrementFormSubmit(event)"
    >
      <h4>Increment</h4>
      <input type="number" name="increment" class="lws-increment" />
    </form>
    <form
      class="decrementForm"
      onsubmit="handleDecrementFormSubmit(event)"
    >
      <h4>Decrement</h4>
      <input type="number" name="decrement" class="lws-decrement" />
    </form>
  </div>
  <div class="numbers">
    <h2 class="lws-singleResult" id="scoreValue"></h2>
  </div>
  `;

  matchesContainer.appendChild(matchElement);
}

// Removing match from DOM
function removeMatchFromDOM(matchIndex) {
  console.log(matchIndex);
  const matchesContainer = document.querySelector(".all-matches");
  const matchElementToRemove = matchesContainer.querySelector(
    `.match:nth-child(${matchIndex})`
  );
  matchesContainer.removeChild(matchElementToRemove);
}

// Render the initial state
render();

// Subscribe to store updates and re-render whenever the store changes
store.subscribe(render);
