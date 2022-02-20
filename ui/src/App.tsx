import * as React from "react";
import "./App.css";

import { clone } from 'lodash';

// Routing Imports
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { authorizor } from "./auth.ts";

// Material UI imports
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
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
  Menu,
  LockOutlined,
  MapsHomeWorkOutlined,
  LocationOnOutlined,
  DragIndicatorOutlined,
  EuroOutlined,
  SquareFootOutlined,
  DeleteOutlineOutlined, Map, HouseOutlined,
} from "@mui/icons-material/";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";


export default function App() {
  const [city, setCity] = React.useState("");
  const [availability, setAvailability] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [area, setArea] = React.useState("");


  const [user, setUser] = React.useState<any>(null);
  const [listings, setListings] = React.useState<any>([]);

  // Constants for new listing validation
  const validCities = ['Αθήνα', 'Θεσσαλονίκη', 'Πάτρα', 'Ηράκλειο'];
  const validAvailability = ['Ενοικίαση', 'Πώληση'];
  const alertMessage = `Έγκυρες Περιοχές: ${validCities} \r\n` +
      `Έγκυρες ακέραιες τιμές: 50 - 5000000\r\n` +
      `Έγκυρη διαθεσιμότητα: ${validAvailability} \r\n` +
      `Έγκυρο ακέραιο εμβδαδόν: 20 - 1000 \r\n`;
    
  const priceRef = React.useRef(null);
  const areaRef = React.useRef(null);

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


  // Theme provider #fe9009 #04a7b7
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
            backgroundColor: "#ffdba8",/*"#04a7b7",*/
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

  interface AuthContextType {
    user: any;
    signin: (/*user: any,*/ callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
  }

  let AuthContext = React.createContext<AuthContextType>(null);

  function AuthProvider({ children }: { children: React.ReactNode }) {
    let signin = (/*newUser, */callback: VoidFunction) => {
      return authorizor.signin(() => {
        //setUser(newUser);
        callback();
      });
    };

    let signout = (callback: VoidFunction) => {
      return authorizor.signout(() => {
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

  function useAuth() {
    return React.useContext(AuthContext);
  }

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );

  function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
  }

  function LoginPage() {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      let formData = new FormData(event.currentTarget);
      //let username = formData.get("username") as string;

      auth.signin(/*username,*/ async () => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: formData.get("username"), password: formData.get("password")})
        };
        const response = await fetch('/auth', requestOptions);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setListings(data.listings);
          navigate("/dashboard", {replace: true});
        } else {
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

        let updatedListings = clone(listings);
        updatedListings.push(data);
        setListings(updatedListings);

        // Clear form state
        setPrice("");
        setCity("");
        setAvailability("");
        setArea("");

      }
    }
  }

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

  function getListings() {

    async function handleDelete(listingId) {

      const response = await fetch(`/listings/${user.id}/${listingId}`, {method: 'DELETE'});
      if (response.ok) {
        let updatedListings = [...listings].filter(i => i.id !== listingId);
        user.listings = updatedListings;
        setListings(updatedListings);
        alert("Listing deleted successfully!");
      }

    }

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
}
