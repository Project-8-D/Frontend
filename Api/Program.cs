using Api.Database;
using Api.Services;
using Api.Services.MqttHandler;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => 
    {
        policy.WithOrigins("http://localhost:3000")
        .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddSingleton<MqttService>();

/*

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<SqliteDbContext>()
                .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };
});*/

var app = builder.Build();

app.Services.GetRequiredService<MqttService>().Start();

// app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();
app.UseAuthentication();
/*app.UseIdentityServer();
*/
app.MapControllers();

app.Run();
