# User Authentication System

This module provides comprehensive user authentication and registration for a farming portal with multiple user types.

## User Types

### 1. End Users (Farmers)

- **Dairy Farmer**: Manages cattle, milk production
- **Poultry Farmer**: Manages birds, egg production (Layer/Broiler)
- **Fish Farmer**: Manages pond, fish types
- **Agriculture Farmer**: Manages land, crop types

### 2. Admin Users

- **Service Provider**: Educational qualification, expertise, job position
- **Trader/Chemist**: Educational qualification, expertise, trading services

### 3. Super Admin

- System administrator with email/password authentication

## Authentication Methods

### For End Users & Admin Users

- **Mobile Number + OTP**: No password required
- Process:
  1. Register with mobile number and profile data
  2. Send OTP to mobile number
  3. Verify OTP to login

### For Super Admin

- **Email + Password**: Traditional login method

## API Endpoints

### Registration

#### End User Registration

```
POST /user/register/end-user
```

**Body Examples:**

Dairy Farmer:

```json
{
  "authType": "END_USER",
  "userType": "DAIRY_FARMER",
  "mobileNumber": "+1234567890",
  "name": "John Doe",
  "address": "123 Farm Road",
  "farmData": {
    "totalCattlePopulation": 50,
    "totalMilkingCow": 30,
    "totalMilkProductionPerDay": 100.5,
    "totalCalf": 20,
    "totalFemaleCalf": 12,
    "totalMaleCalf": 8
  }
}
```

Poultry Farmer:

```json
{
  "authType": "END_USER",
  "userType": "POULTRY_FARMER",
  "mobileNumber": "+1234567890",
  "name": "Jane Smith",
  "address": "456 Poultry Lane",
  "farmData": {
    "farmType": "LAYER",
    "totalBird": 1000,
    "totalEggProductionPerDay": 800
  }
}
```

#### Admin User Registration

```
POST /user/register/admin
```

**Body Example:**

```json
{
  "authType": "ADMIN",
  "userType": "SERVICE_PROVIDER",
  "mobileNumber": "+1234567890",
  "name": "Dr. Expert",
  "address": "789 Service Street",
  "photo": "https://example.com/photo.jpg",
  "lastDegree": "PhD in Agriculture",
  "areaOfExpertise": "Crop Management",
  "serviceExperience": 10,
  "jobPosition": "Senior Consultant"
}
```

#### Super Admin Registration

```
POST /user/register/super-admin
```

**Body:**

```json
{
  "email": "admin@portal.com",
  "password": "securePassword123"
}
```

### Authentication

#### Send OTP

```
POST /user/auth/send-otp
```

**Body:**

```json
{
  "authType": "END_USER",
  "userType": "DAIRY_FARMER",
  "mobileNumber": "+1234567890"
}
```

#### Verify OTP & Login

```
POST /user/auth/verify-otp
```

**Body:**

```json
{
  "authType": "END_USER",
  "userType": "DAIRY_FARMER",
  "mobileNumber": "+1234567890",
  "otp": "123456"
}
```

#### Super Admin Login

```
POST /user/auth/super-admin-login
```

**Body:**

```json
{
  "email": "admin@portal.com",
  "password": "securePassword123"
}
```

### User Management

#### Get User by ID

```
GET /user/:id
```

#### Get All Users

```
GET /user
```

#### Update User Status

```
PATCH /user/:id/status
```

**Body:**

```json
{
  "isActive": false
}
```

## Database Schema

### Models

- **User**: Base user model with auth type and credentials
- **EndUserProfile**: Profile for farmers with farm-specific data
- **AdminUserProfile**: Profile for service providers and traders
- **OTP**: OTP management for mobile authentication

### Key Features

- MongoDB ObjectId for all primary keys
- JSON field for flexible farm data storage
- Separate OTP table for secure authentication
- Cascade deletion for data integrity
- Timestamps for audit trails

## Validation

Uses **Typia** for runtime type checking and validation:

- Email format validation
- Mobile number pattern validation
- Minimum/maximum value constraints
- Required field validation
- Enum value validation

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **OTP Expiration**: 5-minute expiry for OTPs
- **OTP Single Use**: OTPs are marked as used after verification
- **User Verification**: Users marked as verified after OTP confirmation
- **Account Status**: Active/inactive user management

## Error Handling

- **ConflictException**: Duplicate mobile/email registration
- **UnauthorizedException**: Invalid credentials or OTP
- **BadRequestException**: Invalid user data or missing users

## Next Steps

1. **SMS Integration**: Implement Twilio or similar for OTP delivery
2. **JWT Tokens**: Add JWT authentication for session management
3. **Rate Limiting**: Implement OTP request rate limiting
4. **File Upload**: Add image upload for admin user photos
5. **Email Service**: Add email notifications for important actions
