import axios from 'axios'
import {config} from "../config/config"
import { LoginType, SignUpType } from '../types/UserTypes'
import { CognitoIdentityProviderClient, SignUpCommand, SignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider"

