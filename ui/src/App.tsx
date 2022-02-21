import * as React from "react";
import "./App.css";

import { clone } from 'lodash';

import { authorizer } from './auth.ts';

// Routing Imports
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

// Material UI imports
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Chip,
  Stack,
  Divider,
  Select
} from "@mui/material";

// Material icons
import {
  MapsHomeWorkOutlined,
  LocationOnOutlined,
  EuroOutlined,
  SquareFootOutlined,
  DeleteOutlineOutlined, HouseOutlined,
} from "@mui/icons-material/";

import { createTheme, ThemeProvider } from "@mui/material/styles";

/**
 * Main function of the frontend, contains functions that generate the
 * Login and Dashboard page
 */
export default function App() {

  // State of an add listing form
  const [city, setCity] = React.useState("");
  const [availability, setAvailability] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [area, setArea] = React.useState("");

  // User's state
  const [user, setUser] = React.useState<any>(null);
  const [listings, setListings] = React.useState<any>([]);

  // Constants for new listing validation
  const validCities = ['Αθήνα', 'Θεσσαλονίκη', 'Πάτρα', 'Ηράκλειο'];
  const validAvailability = ['Ενοικίαση', 'Πώληση'];

  // The message that is returned when a form is not valid
  const alertMessage = `Έγκυρες Περιοχές: ${validCities} \r\n` +
      `Έγκυρες ακέραιες τιμές: 50 - 5000000\r\n` +
      `Έγκυρη διαθεσιμότητα: ${validAvailability} \r\n` +
      `Έγκυρο ακέραιο εμβδαδόν: 20 - 1000 \r\n`;

  // References used in new listing form
  const priceRef = React.useRef(null);
  const areaRef = React.useRef(null);

  /**
   * Event handler when there is a change in the
   * new listing form
   */
  const handleFormChange = (event) => {
    let value = event.target.value as string;
    switch (event.target.name) {
      case "price":
        setPrice(value);
        setTimeout(() => {
          priceRef.current.children[1].children[0].focus();
        }, 10);
        break;
      case "city-select":
        setCity(value);
        break;
      case "availability-select":
        setAvailability(value);
        break;
      case "sqm":
        setArea(value);
        setTimeout(() => {
          areaRef.current.children[1].children[0].focus();
        }, 10);
        break;
      default:
        return;
    }
  };

  // Theme colors of the system
  const theme = createTheme({
    palette: {
      primary: {
        main: "#fe9009",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            color: "#252628",
            backgroundColor: "#ffdba8",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          colorSecondary: {
            color: "#252628",
            backgroundColor: "#ffdba8",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            color: "#ffffff",
          },
        },
      },
    },
  });

  // signature of an authorization context
  interface AuthContextType {
    user: any;
    signin: (callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
  }

  let AuthContext = React.createContext<AuthContextType>(null);

  /**
   * The authorization provider with basic sign in and sign out functions
   */
  function AuthProvider({ children }: { children: React.ReactNode }) {
    let signin = (callback: VoidFunction) => {
      return authorizer.signin(() => {
        callback();
      });
    };

    let signout = (callback: VoidFunction) => {
      return authorizer.signout(() => {
        // Reset state
        setUser(null);
        setListings([]);
        setArea("");
        setPrice("");
        setAvailability("");
        setCity("");
        callback();
      });
    };

    let value = { user, signin, signout };

    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  /**
   * Use the authorization context
   */
  function useAuth() {
    return React.useContext(AuthContext);
  }

  /**
   * Authorization context used to validate that user can access the page
   * On invalid authorization, the user is redirected to the login page
   */
  function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
  }

  /**
   * Generates the UI of the Login page
   */
  function LoginPage() {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      // Receive the form data from the sign in
      let formData = new FormData(event.currentTarget);

      auth.signin( async () => {

        // Generate the sign in Request
        // We send to the backend the username and password that were received from the form
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: formData.get("username"), password: formData.get("password")})
        };

        // Receive the response from the backend
        const response = await fetch('/auth', requestOptions);

        // If the user was authorized, send them to their dashboard
        if (response.ok) {
          const data = await response.json();
          // Update the state
          setUser(data);
          setListings(data.listings);
          navigate("/dashboard", {replace: true});
        } else {
          // Invalid user authorization
          alert("Username or password is incorrect");
        }
      });
    }

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#fe9009" }}>
            <MapsHomeWorkOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Σύστημα διαχείρισης αγγελιών
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Όνομα Χρήστη"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Κωδικός"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              ΕΙΣΟΔΟΣ
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  /**
   * Utility function that check's if the listing in the form is valid.
   * Valid cities: "Αθήνα", "Θεσσαλονίκη", "Πάτρα", "Ηράκλειο"
   * Valid price: 50 - 5.000.000
   * Valid availability: "Πώληση", "Ενοικίαση"
   * Valid area: 20 - 1.000
   */
  function validateForm(): boolean {

    let parsedPrice = Number(price);
    let parsedArea = Number(area);

    if(!validCities.includes(city) ||
        !validAvailability.includes(availability) ||
        (!Number.isInteger(parsedArea) || !Number.isInteger(parsedPrice)) ||
        (parsedPrice < 50 || parsedPrice > 5000000) ||
        (parsedArea < 20 || parsedArea > 1000)) {

      alert(alertMessage);
      return false;

    }
    return true;
  }

  /**
   * Event handler for the new listing form submit
   */
  async function handleInsertForm(event) {
    event.preventDefault();

    // Only send to backend if form is valid
    if(validateForm()) {

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({price: price, area: area, availability: availability, city: city})
      };

      const response = await fetch(`/listings/${user.id}`, requestOptions);
      if (response.ok) {
        const data = await response.json();

        // Update the user's listings with the newly added listing
        let updatedListings = clone(listings);
        updatedListings.push(data);
        setListings(updatedListings);

        // Clear state of the form
        setPrice("");
        setCity("");
        setAvailability("");
        setArea("");

      }
    }
  }

  /**
   * Utility function that returns the
   * user's new listing form
   */
  function getForm() {

    return (
      <Container>
        <Grid container spacing={2} sx={{ pb: 4 }}>
          <Grid item xs={12}>
            <TextField
              required
              ref={priceRef}
              id="price"
              name="price"
              label="Τιμή"
              value={price}
              fullWidth
              variant="standard"
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="city-label">Περιοχή</InputLabel>
              <Select
                labelId="city-label"
                name="city-select"
                id="city-select"
                value={city}
                label="Περιοχή"
                onChange={handleFormChange}
              >
                <MenuItem value={"Αθήνα"}>Αθήνα</MenuItem>
                <MenuItem value={"Θεσσαλονίκη"}>Θεσσαλονίκη</MenuItem>
                <MenuItem value={"Πάτρα"}>Πάτρα</MenuItem>
                <MenuItem value={"Ηράκλειο"}>Ηράκλειο</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="availability-label">Διαθεσιμότητα</InputLabel>
              <Select
                labelId="availability-label"
                name="availability-select"
                id="availability-select"
                value={availability}
                label="Διαθεσιμότητα"
                onChange={handleFormChange}
              >
                <MenuItem value={"Ενοικίαση"}>Ενοικίαση</MenuItem>
                <MenuItem value={"Πώληση"}>Πώληση</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="sqm"
              ref={areaRef}
              name="sqm"
              value={area}
              label="Εμβδαδόν"
              fullWidth
              variant="standard"
              onChange={handleFormChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button onClick={handleInsertForm} variant="contained">ΠΡΟΣΘΗΚΗ</Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

  /**
   * Delete listing event handler
   * @param listingId The id of the listing to be deleted
   */
  async function handleDelete(listingId) {

    const response = await fetch(`/listings/${user.id}/${listingId}`, {method: 'DELETE'});

    // If we received an OK response, update the user's listings and alert the user
    if (response.ok) {
      let updatedListings = [...listings].filter(i => i.id !== listingId);
      user.listings = updatedListings;
      setListings(updatedListings);
      alert("Listing deleted successfully!");
    }
  }

  /**
   * Utility function that returns the user's listings
   */
  function getListings() {
    return listings.map((listing, i) => {
      return (
        <Grid key={i} container>
          <Grid item xs={3}>
            <Chip
              icon={<LocationOnOutlined />}
              label={listing.city}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <Chip
              icon={<HouseOutlined />}
              label={listing.availability}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <Chip
              icon={<EuroOutlined />}
              label={listing.price}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2}>
            <Chip
              icon={<SquareFootOutlined />}
              label={listing.area + " τ.μ"}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => handleDelete(listing.id)}  aria-label="delete" >
              <DeleteOutlineOutlined />
            </IconButton>
          </Grid>
        </Grid>
      );
    });
  }

  /**
   * Generates the UI of the Dashboard page
   */
  function Dashboard() {
    let auth = useAuth();
    let navigate = useNavigate();

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={() => {
              auth.signout(() => navigate("/"));
            }}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MapsHomeWorkOutlined />
            </IconButton>
            <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Σύστημα διαχείρησης αγγελιών, καλώς ήλθες {auth.user.username}!
            </Typography>
            <Button
              onClick={() => {
                auth.signout(() => navigate("/"));
              }}
              color="inherit"
            >
              ΑΠΟΣΥΝΔΕΣΗ
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ m: 4, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper elevation={6}>
                <Chip label="Νέα Αγγελία" sx={{ m: 2 }} color="secondary" />
                {getForm()}
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Paper elevation={6}>
                <Chip label="Λίστα Αγγελιών" sx={{ m: 2 }} color="secondary" />
                <Container>
                  <Stack
                    divider={<Divider orientation="horizontal" flexItem />}
                    spacing={2}
                    sx={{ pb: 4 }}
                  >
                    {getListings()}
                  </Stack>
                </Container>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // rendering of the App and Routes
  return (
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard"  element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
            />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
  );
}
