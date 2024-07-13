import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// Interfaces
interface UserCredentials {
  role: string;
  password: string;
}

interface Admin {
  id: string;
  name: string;
}

interface Customer extends Admin {}

// Constants
const validCredentials: Record<string, string> = {
  admin: 'admin',
  tester: 'tester',
  user: 'user',
};

const admins: Admin[] = [
  {
    id: '1',
    name: 'John',
  },
  {
    id: '2',
    name: 'Doe',
  },
  {
    id: '3',
    name: 'Anna',
  },
  {
    id: '4',
    name: 'Peter',
  },
];

const customers: Customer[] = [
  {
    id: '5',
    name: 'Lucy',
  },
  {
    id: '6',
    name: 'Michael',
  },
  {
    id: '7',
    name: 'Sarah',
  },
  {
    id: '8',
    name: 'David',
  },
];

// Utils Functions
const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: 'Authorization header missing' });

  jwt.verify(token, secretKey, (err: unknown, decoded: unknown) => {
    if (err)
      return res.status(403).json({ message: 'Invalid or expired token' });

    req.user = decoded;
    next();
  });
};

const authenticateUser = (
  credentials: UserCredentials,
): { token: string } | null => {
  const { role, password } = credentials;
  const storedPassword = validCredentials[role];

  if (!storedPassword || password !== storedPassword) return null;

  const token = jwt.sign({ role }, secretKey, { expiresIn: '6h' });
  return { token };
};

// Initializations
const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'secret';

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (_, res: Response) => {
  res.json({
    base_local_url: 'http://localhost:3000',
    base_local_online:
      'https://express-jwt-gallianoms-gallianoms-projects.vercel.app?_vercel_share=Yi2jUrNLFVVjInnPApEi825FlL1rtASY',
    routes: [
      { method: 'GET', path: '/api/login/ping', description: "Returns 'pong'" },
      {
        method: 'POST',
        path: '/api/login/authenticate',
        description: 'Authenticates user credentials and returns a JWT token',
        example_payload: {
          role: 'admin',
          password: 'admin',
        },
      },
      {
        method: 'GET',
        path: '/api/admin',
        description: 'Retrieves all admins (requires authentication)',
      },
      {
        method: 'GET',
        path: '/api/admin/:id',
        description:
          'Retrieves a specific admin by ID (requires authentication)',
      },
      {
        method: 'GET',
        path: '/api/customers',
        description: 'Retrieves all customers (requires authentication)',
      },
      {
        method: 'GET',
        path: '/api/customers/:id',
        description:
          'Retrieves a specific customer by ID (requires authentication)',
      },
    ],
  });
});

app.get('/api/login/ping', (_, res: Response) => {
  res.send('pong');
});

app.post('/api/login/authenticate', (req: Request, res: Response) => {
  try {
    const { role, password }: UserCredentials = req.body;
    const authResult = authenticateUser({ role, password });

    if (!authResult)
      return res.status(401).json({ message: 'Invalid credentials' });

    return res.status(200).json(authResult);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/admin', verifyToken, (_, res: Response) => {
  res.send({ data: admins });
});

app.get('/api/admin/:id', verifyToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const admin = admins.find(admin => admin.id === id);

  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.send({ data: admin });
});

app.get('/api/customers', verifyToken, (_, res: Response) => {
  res.send({ data: customers });
});

app.get('/api/customers/:id', verifyToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = customers.find(customer => customer.id === id);

  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.send({ data: customer });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

// Note:
// Base Url http://localhost:3000

// Routes:
// 1. GET /api/login/ping - Returns 'pong'
// 2. POST /api/login/authenticate - Authenticates user credentials and returns a JWT token
// 3. GET /api/admin - Retrieves all admins (requires authentication)
// 4. GET /api/admin/:id - Retrieves a specific admin by ID (requires authentication)
// 5. GET /api/customers - Retrieves all customers (requires authentication)
// 6. GET /api/customers/:id - Retrieves a specific customer by ID (requires authentication)

// Reference Guide
// https://medium.com/@diego.coder/autenticaci%C3%B3n-en-node-js-con-json-web-tokens-y-express-ed9d90c5b579
// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
