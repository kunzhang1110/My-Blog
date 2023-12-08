using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MyBlog.Models.Account;
using Microsoft.OpenApi.Models;
using My_Blog.Data;
using My_Blog.Services;

var builder = WebApplication.CreateBuilder(args);



builder.Logging.ClearProviders();
builder.Logging.AddConsole();
//ILogger logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>();

builder.Services
    .AddControllers()
    .AddNewtonsoftJson(opt => opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);//prevent navigation properties reference loops

builder.Services.AddDbContext<MyBlogContext>(
    opt => opt.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")!,
        options => options.EnableRetryOnFailure()));

builder.Services.AddIdentityCore<User>() //add identity service and role-based authorization service
        .AddRoles<Role>()
        .AddEntityFrameworkStores<MyBlogContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<ImageService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });

});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true"); //token saved to localStorage of Swagger
    });
}
else
{
    app.UseHsts();
}

app.UseHttpLogging();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(builder =>
{
    builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
});
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "api/{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html");


//apply migrations to database 
var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<MyBlogContext>();
//var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
try
{
    await context.Database.MigrateAsync(); //apply migrations
    await DbInitializer.Initialize(context, userManager, roleManager); //if context is empty, initialize the database
}
catch (Exception)
{
    //logger.LogError(ex, "A problem occurred during migration");
}

app.Run();


