using Api.Services;
using Api.Services.MqttHandler;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000","http://www.chengeta.xyz", "http://chengeta.xyz", "https://www.chengeta.xyz", "https://chengeta.xyz")
        .AllowCredentials()
        .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddSingleton<MqttService>();
builder.Services.AddSingleton<WebSocketService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateAudience = true,
        ValidateIssuer = true,
        LifetimeValidator = (_, expires, _, _) => expires > DateTime.Now,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"]
    };
});

var app = builder.Build();

app.Services.GetRequiredService<MqttService>().Start();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseWebSockets();

app.MapControllers();

app.Run();
