using Api.Services;
using Api.Services.MqttHandler;

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
builder.Services.AddSingleton<EmailService>();

var app = builder.Build();

app.Services.GetRequiredService<MqttService>().Start();

// app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
