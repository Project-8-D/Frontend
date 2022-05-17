using System;

namespace Api.Services;

public class EmailService
{
    private readonly DatabaseService _databaseService;

    public EmailService(DatabaseService databaseService) 
    {
        _databaseService = databaseService;
    }
    
}