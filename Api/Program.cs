using Api.Database;
using Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000","http://chengeta.xyz", "https://chengeta.xyz")
        .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddScoped<SqliteDbContext>();
builder.Services.AddScoped<DatabaseService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
